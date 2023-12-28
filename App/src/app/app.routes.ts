import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path : '', component: HomeComponent},
    { path : 'about', component: AboutComponent},
    { path : 'not-found', component: NotFoundComponent},
    { path : '**', redirectTo: 'not-found'},
];
