import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService, Priority, Interval } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    AsyncPipe,
    MatCheckboxModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  snackBarError = '';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private taskService: TaskService,
    private router: Router
  ) {}

  createTaskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    isRepeatingTask: [false, [Validators.required]],
    priority: [Priority.Low, Validators.required],
    dueTime: [undefined, [Validators.required]],
    interval: [Interval.Daily, []],
  });

  ngOnInit() {
    // Conditional validator for dueTime or interval fields depending on isRepeatingTask
    this.createTaskForm
      .get('isRepeatingTask')
      ?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          this.createTaskForm.controls['interval'].setValidators([
            Validators.required,
          ]);
          this.createTaskForm.controls['dueTime'].clearValidators();
        } else {
          this.createTaskForm.controls['dueTime'].setValidators([
            Validators.required,
          ]);
          this.createTaskForm.controls['interval'].clearValidators();
        }

        this.createTaskForm.controls['dueTime'].updateValueAndValidity();
        this.createTaskForm.controls['interval'].updateValueAndValidity();
      });
  }

  onSubmit() {
    const { title, isRepeatingTask, priority, dueTime, interval } =
      this.createTaskForm.getRawValue();

    var computedDueDate = new Date();

    if (isRepeatingTask) {
      switch (interval) {
        case Interval.Weekly:
          computedDueDate.setDate(computedDueDate.getDate() + 7);
          break;

        case Interval.Monthly:
          computedDueDate.setMonth(computedDueDate.getMonth() + 1);
          break;

        default:
          computedDueDate.setDate(computedDueDate.getDate() + 1);
          break;
      }
    } else if (dueTime) {
      computedDueDate = new Date(dueTime);
    } else {
      throw new Error('dueTime is required');
    }

    this.taskService
      .createTask(title, priority, isRepeatingTask, computedDueDate)
      .subscribe({
        //TODO : Fix return type (remove any)
        next: (_: any) => {
          console.log('task created successfully !');
          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          //TODO: Fix validation display
          console.error(err);

          if (err.status == 400) {
            this.snackBar.open(
              `Failed to create task: ${err.error.error._message}`,
              'Dismiss',
              {
                duration: 8000,
              }
            );
          } else {
            this.snackBar.open(err.message, 'Dismiss', {
              duration: 12000,
            });
          }

          this.snackBarError = err.statusText;
        },
      });
  }
}
