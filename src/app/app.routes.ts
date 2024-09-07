import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },

  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register/register.page').then( m => m.RegisterPage)
  },
  
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.page').then( m => m.LoginPage)
  },

  {
    path: '',
    loadChildren: () => import('./shared/ui/pages/tabs/tabs.routes').then( m => m.routes),
    canActivate:[()=> inject(AuthGuard).canActive()]
  },

];
