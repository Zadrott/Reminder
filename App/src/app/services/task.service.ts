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

enum Priority {
  Low,
  Medium,
  High,
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
      .pipe(
        catchError(this.handleError<TaskData[]>(`error while fetching data`))
      )
      .subscribe((receivedTasks) => {
        console.log('Tasks fetched from the API:', receivedTasks);
        this.tasks$.next(receivedTasks);
      });
  }

  getAllTasks(): Subject<TaskData[]> {
    this.fetchTasks();
    return this.tasks$;
  }

  deleteTask(id: string): Observable<string> {
    const token = localStorage.getItem(environment.USER_TOKEN_KEY);
    const headers = { Authorization: 'Bearer ' + token };
    return this.httpClient.delete(`${environment.API_URL}/tasks/${id}`, {headers: headers, responseType: 'text'})
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
