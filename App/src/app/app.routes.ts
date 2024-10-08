import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { AboutComponent } from './pages/about/about.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [() => inject(AuthService).shouldLogIn()],
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [() => inject(AuthService).isLoggedIn()],
    component: NavBarComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
    ],
  },
  {
    path: 'tasks',
    canActivate: [() => inject(AuthService).isLoggedIn()],
    component: NavBarComponent,
    children: [
      {
        path: 'create',
        component: AddTaskComponent,
      },
    ],
  },
  {
    path: '**',
    component: NavBarComponent,
    children: [
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];
