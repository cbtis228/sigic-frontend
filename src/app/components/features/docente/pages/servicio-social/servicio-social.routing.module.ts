import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';
import { ServicioSocialComponent } from './servicio-social.component';

const routes: Routes = [
  {
    path: '',
    component: ServicioSocialComponent,
    canActivate: [PermissionGuard],
    data: { permissions: [
      'academico.view_serviciosocial',
      'alumnos.view_alumno',
    ] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioSocialRoutingModule {}

