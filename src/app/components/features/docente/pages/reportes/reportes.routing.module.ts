import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicosComponent } from './academicos/academicos.component';

const routes: Routes = [
  {
    path: 'academicos',
    component: AcademicosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
