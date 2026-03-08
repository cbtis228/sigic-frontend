import { Component } from '@angular/core';
import { Horario } from '../../../../../../interfaces/academico.interface';
import { Docente, DocenteGrupo } from '../../../../../../interfaces/docente.interface';
import { forkJoin } from 'rxjs';
import { DocenteService } from '../../../../../../services/docente.service';
import { CommonModule } from '@angular/common';
import { HorarioSemanalCardComponent } from '../../../../../shared/horario-semanal-card/horario-semanal-card.component';

@Component({
  selector: 'app-horario',
  imports: [CommonModule, HorarioSemanalCardComponent],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.scss',
})
export class HorarioComponent {
  constructor(private docenteService: DocenteService) {}

  horarios: Horario[] | null = null
  grupos: any = null
  docente!: Docente;
  activeTab: 'horario' | 'materias' = 'horario';
  completedFirstRequest = false

  ngOnInit(): void {
    forkJoin({
      horarios: this.docenteService.HorarioSelfListCurrent(),
      grupos: this.docenteService.AsignacionDocenteSelfListCurrent(),
    }).subscribe({
      next: ({ horarios, grupos }) => {
        this.completedFirstRequest = true
        this.horarios = horarios;
        this.grupos = grupos;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
