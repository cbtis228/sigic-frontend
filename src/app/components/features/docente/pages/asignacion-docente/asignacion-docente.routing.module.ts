import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';
import { AsignacionDocenteComponent } from './asignacion-docente.component';

const routes: Routes = [
  {
    path: '',
    component: AsignacionDocenteComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        'academico.view_asignaciondocente',
        'academico.view_grupo',
        'docentes.view_docente',
        'alumnos.view_alumno',
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignacionDocenteRoutingModule {}
