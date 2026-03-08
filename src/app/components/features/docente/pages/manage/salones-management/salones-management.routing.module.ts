import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../../guards/permission.guard';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { GeneralComponent } from './general/general.component';
import { CreateComponent } from './create/create.component';
import { SalonesManagementComponent } from './salones-management.component';
import { EditComponent } from './general/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_salon'] },
    component: SalonesManagementComponent,
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.add_salon'] },
    component: CreateComponent,
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    component: DetailContainerComponent,
    data: { permissions: ['academico.view_salon'] },
    children: [
      {
        path: 'general',
        canActivate: [PermissionGuard],
        component: GeneralComponent,
        data: {
          permissions: ['academico.view_salon'],
        },
      },
      {
        path: 'general/edit',
        canActivate: [PermissionGuard],
        component: EditComponent,
        data: {
          permissions: ['academico.change_salon'],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalonesManagementRoutingModule {}
