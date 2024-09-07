
import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  
  {
    path: 'home',
    loadComponent: () => import('./../../../../home/home.page').then((m) => m.HomePage)
  },

  {
    path: 'gallery',
    loadComponent: () => import('./../../../../gallery/pages/gallery/gallery.page').then((m) => m.HomePage)
  },

  {
    path: 'profile',
    loadComponent: () => import('./../../../../profile/pages/profile/profile.page').then((m) => m.HomePage)
  },
];
