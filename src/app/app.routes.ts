import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'search',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'program-details/:id',
    loadComponent: () => import('./pages/program-details/program-details.page').then((m) => m.ProgramDetailsPage),
  },
];
