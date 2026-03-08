import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'personal',
    loadChildren: () =>
      import('./pages/personal/personal.routing.module').then(
        (m) => m.PersonalRoutingModule,
      ),
  },
  {
    path: 'data',
    loadChildren: () =>
      import('./pages/data/data.routing.module').then(
        (m) => m.DocenteGeneralRoutingModule,
      ),
  },
  {
    path: 'alumnos',
    loadChildren: () =>
      import('./pages/alumnos/alumnos.routing.module').then(
        (m) => m.AlumnosManagementRoutingModule,
      ),
  },
  {
    path: 'asistencias',
    loadChildren: () =>
      import('./pages/asistencias/asistencias.routing.module').then(
        (m) => m.AsistenciasManagementRoutingModule,
      ),
  },
  {
    path: 'asignacion-docente',
    loadChildren: () =>
      import('./pages/asignacion-docente/asignacion-docente.routing.module').then(
        (m) => m.AsignacionDocenteRoutingModule,
      ),
  },
  {
    path: 'capacitaciones',
    loadChildren: () =>
      import('./pages/capacitaciones/capacitaciones.routing.module').then(
        (m) => m.CapacitacionesRoutingModule,
      ),
  },
  {
    path: 'manage',
    loadChildren: () =>
      import('./pages/manage/manage.routing.module').then(
        (m) => m.DocenteManageRoutingModule,
      ),
  },
  {
    path: 'inscripciones',
    loadChildren: () =>
      import('./pages/inscripciones/inscripciones.routing.module').then(
        (m) => m.InscripcionRoutingModule,
      ),
  },
  {
    path: 'incidencias',
    loadChildren: () =>
      import('./pages/incidencias/incidencias.routing.module').then(
        (m) => m.IncidenciasRoutingModule,
      ),
  },
  {
    path: 'horarios',
    loadChildren: () =>
      import('./pages/horarios/horarios.routing.module').then(
        (m) => m.HorariosRoutingModule,
      ),
  },
  {
    path: 'servicio-social',
    loadChildren: () =>
      import('./pages/servicio-social/servicio-social.routing.module').then(
        (m) => m.ServicioSocialRoutingModule,
      ),
  },
  {
    path: 'reportes',
    loadChildren: () =>
      import('./pages/reportes/reportes.routing.module').then(
        (m) => m.ReportesRoutingModule,
      ),
  },
  {
    path: 'downloads',
    loadChildren: () =>
      import('./pages/downloads/downloads.routing.module').then(
        (m) => m.DownloadsRoutingModule,
      ),
  },
  {
    path: 'inventarios',
    loadChildren: () =>
      import('./pages/inventarios/inventarios.routing.module').then(
        (m) => m.InventariosRoutingModule,
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocenteRoutingModule { }
