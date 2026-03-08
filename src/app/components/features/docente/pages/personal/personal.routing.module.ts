import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorarioComponent } from './horario/horario.component';

const routes: Routes = [
  {
    path: 'horario',
    component: HorarioComponent,
  },
  {
    path: 'materias',
    loadChildren: () =>
      import('./materias/materias.routing.module').then(
        (m) => m.MateriasRoutingModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalRoutingModule {}
