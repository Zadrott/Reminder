import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string) {
    return this.httpClient
      .post(`${environment.apiUrl}/users/login`, { email, password })
      .pipe(
        map((res: any) => {
          console.log('Result:', res);
          return res;
        })
      );
  }

  register(email: string, password: string) {
    return this.httpClient
      .post(`${environment.apiUrl}/users/register`, { email, password })
      .pipe(
        map((res: any) => {
          console.log('Result:', res);
          return res;
        })
      );
  }
}
