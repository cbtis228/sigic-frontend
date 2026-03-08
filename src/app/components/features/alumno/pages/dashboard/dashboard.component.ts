import { Component } from '@angular/core';
import { AlumnosService } from '../../../../../services/alumnos.service';
import {
  Alumno,
  AlumnoHorario,
} from '../../../../../interfaces/alumno.interface';
import { CommonModule } from '@angular/common';
import { CardButtonComponent } from '../../../../shared/card-button/card-button.component';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CardButtonComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  alumno: Alumno | null = null;
  horario: AlumnoHorario[] = [];
  today = new Date();
constructor(private alumnoService: AlumnosService) {
  forkJoin({
    horario: this.alumnoService.HorarioSelfListCurrentApi().pipe(
      catchError(err => {
        console.error("Error cargando horario:", err);
        return of([]);
      })
    ),
    alumno: this.alumnoService.AlumnoSelfDetailApi().pipe(
      catchError(err => {
        console.error("Error cargando alumno:", err);
        return of(null);
      })
    ),
  }).subscribe({
    next: (response) => {
      this.alumno = response.alumno;
      this.horario = response.horario;
    },
  });
}

  get todayHorario() {
    const day = this.today.getDay();

    return this.horario
      .filter((h) => h.dia_semana === day)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }
}
