import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardButtonComponent } from '../../../../shared/card-button/card-button.component';
import { DocenteService } from '../../../../../services/docente.service';
import { Docente } from '../../../../../interfaces/docente.interface';
import { catchError, forkJoin, of } from 'rxjs';
import { Horario } from '../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  docente: Docente | null = null;
  today = new Date()
  horario: Horario[] = []
  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    forkJoin({
      horario: this.docenteService.HorarioSelfListCurrent().pipe(
        catchError((err) => {
          console.error('Error cargando horario:', err);
          return of([]);
        }),
      ),
      docente: this.docenteService.DocenteSelfDetailApi().pipe(
        catchError((err) => {
          console.error('Error cargando docente:', err);
          return of(null);
        }),
      ),
    }).subscribe({
      next: (response) => {
        this.docente = response.docente;
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
