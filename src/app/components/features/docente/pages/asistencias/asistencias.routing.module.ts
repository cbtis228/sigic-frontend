import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';
import { AsistenciasComponent } from './asistencias.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_asistencia'] },
    component: AsistenciasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciasManagementRoutingModule {}
