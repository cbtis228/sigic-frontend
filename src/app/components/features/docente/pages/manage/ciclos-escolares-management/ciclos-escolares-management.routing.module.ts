import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../../guards/permission.guard';
import { CiclosEscolaresManagementComponent } from './ciclos-escolares-management.component';
import { CreateComponent } from './create/create.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { GruposComponent } from './grupos/grupos.component';
import { GeneralComponent } from './general/general.component';
import { EditComponent } from './general/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_cicloescolar'] },
    component: CiclosEscolaresManagementComponent,
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.add_cicloescolar'] },
    component: CreateComponent,
  },

  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_cicloescolar'] },
    component: DetailContainerComponent,
    children: [
      {
        path: 'general',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['academico.view_cicloescolar'],
        },
        component: GeneralComponent,
      },
      {
        path: 'general/edit',
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            'academico.change_cicloescolar',
            'academico.view_cicloescolar',
          ],
        },
        component: EditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CiclosEscolaresManagementRoutingModule {}
