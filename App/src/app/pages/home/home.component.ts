import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { TaskData, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    AsyncPipe,
    RouterLink,
  ],
})
export class HomeComponent {
  tasks$: Observable<TaskData[]> = new Observable();

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: (_: any) => {
        this.snackBar.open('Task removed successfully !', 'Dismiss', {
          duration: 3000,
        });
      },
      error: (err: any) => {
        console.error(err);
        this.snackBar.open(err.error.message, 'Dismiss', {
          duration: 12000,
        });
      },
    });
  }

  private fetchTasks(): void {
    this.tasks$ = this.taskService.getAllTasks();
  }
}
