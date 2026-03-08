import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';
import { InscripcionesComponent } from './inscripciones.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: [
      'academico.view_inscripcion',
      'alumnos.view_alumno',
      'academico.view_grupo',
    ] },
    component: InscripcionesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscripcionRoutingModule {}
