import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

import { environment } from '../environment';

export interface UserData {
  token: string;
  userId: string;
  expire: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<UserData | null | undefined> =
    new BehaviorSubject<UserData | null | undefined>(undefined);

  constructor(private httpClient: HttpClient) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem(environment.USER_TOKEN_KEY);
    const userId = localStorage.getItem(environment.USER_ID_KEY);
    const tokenExpire = localStorage.getItem(environment.USER_EXPIRE_KEY);

    if (token && userId && tokenExpire) {
      const loadedUser: UserData = {
        token: token,
        userId: userId,
        expire: parseInt(tokenExpire),
      };

      this.user.next(loadedUser);
    } else {
      this.user.next(null);
    }
  }

  login(email: string, password: string) {
    return this.httpClient
      .post(`${environment.API_URL}/users/login`, { email, password })
      .pipe(
        map((res: any) => {
          console.log('Result:', res);

          localStorage.setItem(environment.USER_TOKEN_KEY, res.token);
          localStorage.setItem(environment.USER_EXPIRE_KEY, res.expire);
          localStorage.setItem(environment.USER_ID_KEY, res.userId);

          const loadedUser: UserData = {
            token: res.token,
            userId: res.userId,
            expire: res.expire,
          };

          this.user.next(loadedUser);

          return res;
        })
      );
  }

  register(email: string, password: string) {
    return this.httpClient
      .post(`${environment.API_URL}/users/register`, { email, password })
      .pipe(
        map((res: any) => {
          console.log('Result:', res);
          return this.login(email, password);
        })
      );
  }

  signOut() {
    localStorage.removeItem(environment.USER_TOKEN_KEY);
    localStorage.removeItem(environment.USER_ID_KEY);
    localStorage.removeItem(environment.USER_EXPIRE_KEY);

    this.user.next(null);
  }

  getCurrentUser() {
    return this.user.asObservable();
  }

  getCurrentUserId() {
    return this.user.getValue()?.userId;
  }

  isLoggedIn(): Observable<Boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrentUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        const isExpired =
          !this.user.value?.expire ||
          this.user.value?.expire < Math.floor(Date.now() / 1000);

        if (isAuthenticated && !isExpired) {
          return true;
        } else {
          alert('Your session is expired. Please relog in');
          return router.createUrlTree(['/login']);
        }
      })
    );
  }

  shouldLogIn(): Observable<Boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrentUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        const isExpired =
          !this.user.value?.expire ||
          this.user.value?.expire < Math.floor(Date.now() / 1000);

        if (isAuthenticated && !isExpired) {
          return router.createUrlTree(['/']);
        } else {
          return true;
        }
      })
    );
  }
}
