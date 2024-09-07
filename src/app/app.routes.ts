import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate:[()=> inject(AuthGuard).canActive()]
  },

  {
    path: 'tabs',
    loadComponent: () => import('./shared/ui/pages/tabs/tabs.page').then( m => m.TabsPage),
    canActivate:[()=> inject(AuthGuard).canActive()]
  },  {
    path: 'gallery',
    loadComponent: () => import('./gallery/pages/gallery/gallery.page').then( m => m.GalleryPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/pages/profile/profile.page').then( m => m.ProfilePage)
  },



];
