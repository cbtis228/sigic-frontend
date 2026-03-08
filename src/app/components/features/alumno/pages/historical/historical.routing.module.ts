import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesComponent } from './notes/notes.component';
import { ServicioSocialComponent } from './servicio-social/servicio-social.component';

const routes: Routes = [
  {
    path: 'notes',
    component: NotesComponent,
  },
  {
    path: 'servicio-social',
    component: ServicioSocialComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricalRoutingModule {}
