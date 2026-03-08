import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../../../../guards/permission.guard';
import { CapacitacionesComponent } from './capacitaciones.component';

const routes: Routes = [
  {
    path: '',
    component: CapacitacionesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapacitacionesRoutingModule {}
