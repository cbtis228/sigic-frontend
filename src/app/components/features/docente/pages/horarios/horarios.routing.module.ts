import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorariosComponent } from './horarios.component';
import { DetailComponent } from './detail/detail.component';
import { PermissionGuard } from '../../../../../guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: HorariosComponent,
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_horario'] },
  },
  {
    path: 'grupo/:id',
    component: DetailComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        'academico.view_horario',
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorariosRoutingModule {}
