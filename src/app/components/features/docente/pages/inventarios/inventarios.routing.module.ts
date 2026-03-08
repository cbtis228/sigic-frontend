import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PermissionGuard } from "../../../../../guards/permission.guard";
import { GeneralComponent } from "../data/general/general.component";
import { InventariosComponent } from "./inventarios.component";
import { UbicacionesComponent } from "./ubicaciones/ubicaciones.component";
import { getDataPaginated } from "../../../../../resolvers/initial-table-data.resolver";

const routes: Routes =[
  {
    path: '',
    component: InventariosComponent
  },
  {
    path: 'ubicaciones',
    component: UbicacionesComponent,
    resolve: {ubicaciones: getDataPaginated},
    data: {permissions: ['inventario.view_ubicacion'], endpointName: 'inventarios/ubicaciones'}
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventariosRoutingModule {}
