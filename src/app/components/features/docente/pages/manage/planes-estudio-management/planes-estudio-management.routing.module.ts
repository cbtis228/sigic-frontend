import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../../guards/permission.guard';
import { PlanesEstudioManagementComponent } from './planes-estudio-management.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { GeneralComponent } from './general/general.component';
import { EditComponent } from './general/edit/edit.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_planestudio'] },
    component: PlanesEstudioManagementComponent,
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.add_planestudio'] },
    component: CreateComponent,
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    component: DetailContainerComponent,
    data: { permissions: ['academico.view_planestudio'] },
    children: [
      {
        path: 'general',
        canActivate: [PermissionGuard],
        component: GeneralComponent,
        data: {
          permissions: ['academico.view_planestudio'],
        },
      },
      {
        path: 'general/edit',
        canActivate: [PermissionGuard],
        component: EditComponent,
        data: {
          permissions: ['academico.change_planestudio'],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanesEstudioManagementRoutingModule {}
