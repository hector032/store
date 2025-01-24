import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../app/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
