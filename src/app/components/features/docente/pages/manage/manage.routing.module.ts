import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';

const routes: Routes = [
  {
    path: 'ciclos-escolares',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_cicloescolar'] },
    loadChildren: () =>
      import(
        './ciclos-escolares-management/ciclos-escolares-management.routing.module'
      ).then((m) => m.CiclosEscolaresManagementRoutingModule),
  },
  {
    path: 'grupos',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_grupo'] },
    loadChildren: () =>
      import('./grupos-management/grupos-management.routing.module').then(
        (m) => m.GruposManagementRoutingModule
      ),
  },
  {
    path: 'docentes',
    canActivate: [PermissionGuard],
    data: { permissions: ['docentes.view_docente'] },
    loadChildren: () =>
      import('./docentes-management/docentes-management.routing.module').then(
        (m) => m.DocentesManagementRoutingModule
      ),
  },
  {
    path: 'materias',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_materia'] },
    loadChildren: () =>
      import('./materias-management/materias-management.routing.module').then(
        (m) => m.MateriasManagementRoutingModule
      ),
  },
  {
    path: 'planes-estudio',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_planestudio'] },
    loadChildren: () =>
      import(
        './planes-estudio-management/planes-estudio-management.routing.module'
      ).then((m) => m.PlanesEstudioManagementRoutingModule),
  },
  {
    path: 'salones',
    canActivate: [PermissionGuard],
    data: { permissions: ['academico.view_salon'] },
    loadChildren: () =>
      import('./salones-management/salones-management.routing.module').then(
        (m) => m.SalonesManagementRoutingModule
      ),
  },
  {
    path: 'configuracion',
    canActivate: [PermissionGuard],
    data: { permissions: ['core.view_configuracion'] },
    loadChildren: () =>
      import(
        './configuracion-management/configuracion-management.routing.module'
      ).then((m) => m.ConfiguracionManagementRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocenteManageRoutingModule {}
