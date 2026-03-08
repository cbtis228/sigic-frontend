import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../../guards/permission.guard';
import { MateriasManagementComponent } from './materias-management.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { GeneralComponent } from './general/general.component';
import { EditComponent } from './general/edit/edit.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_materia'] },
    component: MateriasManagementComponent,
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.add_materia'] },
    component: CreateComponent,
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    component: DetailContainerComponent,
    data: { permissions: ['academico.view_materia'] },
    children: [
      {
        path: 'general',
        canActivate: [PermissionGuard],
        component: GeneralComponent,
        data: {
          permissions: ['academico.view_grupo'],
        },
      },
      {
        path: 'general/edit',
        canActivate: [PermissionGuard],
        component: EditComponent,
        data: {
          permissions: ['academico.change_grupo'],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MateriasManagementRoutingModule {}
