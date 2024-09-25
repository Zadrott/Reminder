import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, shareReplay } from 'rxjs';

import { TaskService, Priority } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  private breakpointObserver = inject(BreakpointObserver);

  // TODO: check if breakpoint is used or not
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  error = '';

  //TODO: Fix form validators
  createTaskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    type: [false, [Validators.required]],
    priority: [Priority.Low, Validators.required],
    dueTime: [new Date(), [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private taskService: TaskService,
    private router: Router
  ) {}

  onSubmit() {
    const { title, type, priority, dueTime } =
      this.createTaskForm.getRawValue();

    console.log('Submit:', this.createTaskForm.value);

    this.taskService.createTask(title, priority, type, dueTime).subscribe({
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

        this.error = err.statusText;
      },
    });
  }
}
