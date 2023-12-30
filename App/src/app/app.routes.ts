import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    canActivate: [() => inject(AuthService).isLoggedIn()],
    component: HomeComponent,
  },
  {
    path: 'login',
    canActivate: [() => inject(AuthService).shouldLogIn()],
    component: LoginComponent,
  },
  {
    path: 'about',
    canActivate: [() => inject(AuthService).isLoggedIn()],
    component: AboutComponent,
  },
  { path: '**', component: NotFoundComponent },
];
