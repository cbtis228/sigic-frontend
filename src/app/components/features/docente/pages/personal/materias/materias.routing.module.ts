import { RouterModule, Routes } from '@angular/router';
import { GruposComponent } from './materias.component';
import { NgModule } from '@angular/core';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  {
    path: '',
    component: GruposComponent,
  },
  {
    path: ':id/general',
    component: GeneralComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MateriasRoutingModule {}
