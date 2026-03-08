import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';
import { AlumnosManagementComponent } from './alumnos.component';
import { ContactosEmergenciaComponent } from './contactos-emergencia/contactos-emergencia.component';
import { EditComponent as EditComponentContactoEmergenciaAlumno } from './contactos-emergencia/edit/edit.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { DatosFacturacionComponent } from './datos-facturacion/datos-facturacion.component';
import { EditComponent as EditComponentDatosFacturacionAlumno } from './datos-facturacion/edit/edit.component';
import { GeneralComponent } from './general/general.component';
import { EditComponent as EditComponentGeneralAlumno } from './general/edit/edit.component';
import { CreateComponent } from './create/create.component';
import { HistorialAcademicoComponent } from './historial-academico/historial-academico.component';

const routes: Routes = [
  {
    path: '',
    component: AlumnosManagementComponent,
  },
  {
    path: 'create',
    canActivate: [PermissionGuard],
    data: { permissions: ['alumnos.add_alumno'] },
    component: CreateComponent,
  },
  {
    path: ':id',
    canActivate: [PermissionGuard],
    data: { permissions: ['alumnos.view_alumno'] },
    component: DetailContainerComponent,
    children: [
      {
        path: 'general',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['alumnos.view_alumno'],
        },
        component: GeneralComponent,
      },
      {
        path: 'general/edit',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['alumnos.change_alumno', 'alumnos.view_alumno'],
        },
        component: EditComponentGeneralAlumno,
      },
      {
        path: 'contactos-emergencia',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['alumnos.view_contactosemergencia'],
        },
        component: ContactosEmergenciaComponent,
      },
      {
        path: 'contactos-emergencia/edit',
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            'alumnos.change_contactosemergencia',
            'alumnos.view_contactosemergencia',
          ],
        },
        component: EditComponentContactoEmergenciaAlumno,
      },
      {
        path: 'datos-facturacion',
        canActivate: [PermissionGuard],
        data: {
          permissions: ['alumnos.view_datosfacturacion'],
        },
        component: DatosFacturacionComponent,
      },
      {
        path: 'datos-facturacion/edit',
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            'alumnos.view_datosfacturacion',
            'alumnos.change_datosfacturacion',
          ],
        },
        component: EditComponentDatosFacturacionAlumno,
      },
      {
        path: 'historial-academico',
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            'academico.view_historialacademico',
            'academico.add_historialacademico',
            'academico.change_historialacademico',
            'academico.delete_historialacademico',
          ],
        },
        component: HistorialAcademicoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnosManagementRoutingModule {}
