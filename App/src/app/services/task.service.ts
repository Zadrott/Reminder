import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, tap, map, of } from 'rxjs';

import { environment } from '../environment';

export interface TaskData {
  _id: string;
  title: string;
  priority: Priority;
  creationDate: Date;
  dueDate: Date;
  isRepeatingTask: boolean;
  isDone: boolean;
}

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks$: Subject<TaskData[]> = new Subject();

  constructor(private httpClient: HttpClient) {
    this.fetchTasks();
  }

  fetchTasks() {
    const token = localStorage.getItem(environment.USER_TOKEN_KEY);
    const headers = { Authorization: 'Bearer ' + token };

    this.httpClient
      .get<TaskData[]>(`${environment.API_URL}/tasks`, { headers })
      .subscribe((receivedTasks) => {
        console.log('Tasks fetched from the API:', receivedTasks);
        this.tasks$.next(receivedTasks);
      });
  }

  getAllTasks(): Subject<TaskData[]> {
    this.fetchTasks();
    return this.tasks$;
  }

  createTask(
    title: string,
    priority: Priority,
    isRepeatingTask: boolean,
    dueDate: Date
  ): any {
    const token = localStorage.getItem(environment.USER_TOKEN_KEY);
    const headers = { Authorization: 'Bearer ' + token };

    const task = {
      title,
      priority,
      isRepeatingTask,
      dueDate,
    };

    return this.httpClient
      .post<TaskData[]>(`${environment.API_URL}/tasks/`, task, {
        headers: headers,
      })
      .pipe(
        map((res: any) => {
          console.log('Result:', res);
          this.tasks$.next(res);

          return res;
        })
      );
  }

  deleteTask(id: string): any {
    const token = localStorage.getItem(environment.USER_TOKEN_KEY);
    const headers = { Authorization: 'Bearer ' + token };
    return this.httpClient
      .delete<TaskData[]>(`${environment.API_URL}/tasks/${id}`, {
        headers: headers,
      })
      .pipe(
        map((res: any) => {
          console.log('Result:', res);
          this.tasks$.next(res);

          return res;
        })
      );
  }
}
