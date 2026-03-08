import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';
import { IncidenciasComponent } from './incidencias.component';

const routes: Routes = [
  {
    path: '',
    component: IncidenciasComponent,
    canActivate: [PermissionGuard],
    data: { permissions: [
      'academico.view_incidencia',
      'alumnos.view_alumno',
      'academico.view_grupo',
    ] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidenciasRoutingModule {}
