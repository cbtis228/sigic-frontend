import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { EditComponent } from './general/edit/edit.component';

const routes: Routes = [
  { path: 'general', component: GeneralComponent },
  { path: 'general/edit', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteGeneralRoutingModule { }
