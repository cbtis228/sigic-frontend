import {  Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/sesion/login/login.component';
import { LoginSuccesComponent } from './components/sesion/login-succes/login-succes.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'alumno',
    component: MainComponent,
    canActivate: [RoleGuard],
    data: { roles: ['alumno'] },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/features/alumno/alumno.routing.module').then(
            (m) => m.AlumnoRoutingModule,
          ),
      },
    ],
  },
  {
    path: 'docente',
    component: MainComponent,
    canActivate: [RoleGuard],
    data: { roles: ['docente'] },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/features/docente/docente.routing.module').then(
            (m) => m.DocenteRoutingModule,
          ),
      },
    ],
  },
  {
    path: 'session/login',
    component: LoginComponent,
  },
  {
    path: 'session/login-success',
    component: LoginSuccesComponent,
  },
  { path: '**', redirectTo: 'session/login-success', pathMatch: 'full' },
];
