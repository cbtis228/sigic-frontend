import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../../../../../services/alumnos.service';
import { HorarioSemanalCardComponent } from '../../../../shared/horario-semanal-card/horario-semanal-card.component';
import { CommonModule } from '@angular/common';
import { Horario } from '../../../../../interfaces/academico.interface';
import { TabsModule } from 'primeng/tabs';
import { AlumnoHistorialAcademico } from '../../../../../interfaces/alumno.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-horario',
  imports: [HorarioSemanalCardComponent, CommonModule, TabsModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.scss',
})
export class HorarioComponent implements OnInit {
  constructor(private alumnoService: AlumnosService) {}

  horarios: Horario[] | null = null
  historial: AlumnoHistorialAcademico[] | null = null
  activeTab: 'horario' | 'materias' = 'horario';

  ngOnInit(): void {
    forkJoin({
      horarios: this.alumnoService.HorarioSelfListCurrentApi(),
      historial: this.alumnoService.HistorialSelfListCurrentApi()
    }).subscribe({
      next: ({ horarios, historial }) => {
        this.horarios = horarios as Horario[];
        this.historial = historial as AlumnoHistorialAcademico[];
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
