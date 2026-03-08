import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'data',
    loadChildren: () =>
      import('./pages/data/data.routing.module').then(
        (m) => m.AlumnoGeneralRoutingModule,
      ),
  },
  {
    path: 'horario',
    loadChildren: () =>
      import('./pages/horario/horario.routing.module').then(
        (m) => m.HorarioRoutingModule,
      ),
  },
  {
    path: 'historical',
    loadChildren: () =>
      import('./pages/historical/historical.routing.module').then(
        (m) => m.HistoricalRoutingModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnoRoutingModule {}
