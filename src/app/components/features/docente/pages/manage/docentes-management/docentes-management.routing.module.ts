import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../../guards/permission.guard';
import { DocentesManagementComponent } from './docentes-management.component';
import { CreateComponent } from './create/create.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { GeneralComponent } from './general/general.component';
import { EditComponent as EditComponentGeneralDocente } from './general/edit/edit.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { CapacitacionesComponent } from './capacitaciones/capacitaciones.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: ['docentes.view_docente'] },
    component: DocentesManagementComponent,
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    data: { permissions: ['docentes.add_docente'] },
    component: CreateComponent,
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: { permissions: ['docentes.view_docente'] },
    component: DetailContainerComponent,
    children: [
      {
        path: 'documentacion',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['docentes.view_filedocente'],
        },
        component: DocumentacionComponent,
      },
        {
        path: 'capacitaciones',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['docentes.view_capacitacion'],
        },
        component: CapacitacionesComponent,
      },
      {
        path: 'general',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['docentes.view_docente'],
        },
        component: GeneralComponent,
      },
      {
        path: 'general/edit',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['docentes.change_docente', 'docentes.view_docente'],
        },
        component: EditComponentGeneralDocente,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocentesManagementRoutingModule {}
