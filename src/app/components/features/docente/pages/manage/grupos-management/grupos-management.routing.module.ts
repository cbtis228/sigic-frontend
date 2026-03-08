import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../../guards/permission.guard';
import { CreateComponent } from './create/create.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { GruposManagementComponent } from './grupos-management.component';
import { GeneralComponent } from './general/general.component';
import { EditComponent } from './general/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_grupo'] },
    component: GruposManagementComponent,
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.add_grupo'] },
    component: CreateComponent,
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_grupo'] },
    component: DetailContainerComponent,
    children: [
      {
        path: 'general',
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            'academico.view_grupo',
          ],
        },
        component: GeneralComponent
      },
      {
        path: 'general/edit',
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            'academico.change_grupo',
            'academico.view_grupo',
          ],
        },
        component: EditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GruposManagementRoutingModule {}
