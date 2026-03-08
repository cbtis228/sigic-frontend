import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { EditComponent as EditComponentGeneral } from './general/edit/edit.component';
import { ContactosEmergenciaComponent } from './contactos-emergencia/contactos-emergencia.component';
import { EditComponent as EditComponentContactoEmergencia } from './contactos-emergencia/edit/edit.component';
import { DatosFacturacionComponent } from './datos-facturacion/datos-facturacion.component';
import { EditComponent as EditComponentDatosFacturacion } from './datos-facturacion/edit/edit.component';

const routes: Routes = [
  { path: 'general', component: GeneralComponent },
  { path: 'general/edit', component: EditComponentGeneral },
  { path: 'contactos-emergencia', component: ContactosEmergenciaComponent },
  { path: 'contactos-emergencia/edit', component: EditComponentContactoEmergencia },
  { path: 'datos-facturacion', component: DatosFacturacionComponent },
  { path: 'datos-facturacion/edit', component: EditComponentDatosFacturacion  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoGeneralRoutingModule { }
