import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../../../../../../services/docente.service';
import { forkJoin } from 'rxjs';
import {
  Docente,
  DocenteAsignacionDocente,
  DocenteGrupo,
} from '../../../../../../interfaces/docente.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-materias',
  imports: [CommonModule],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.scss',
})
export class GruposComponent {
  constructor(
    private docenteService: DocenteService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  asignaciones: DocenteAsignacionDocente[] = [];
  docente!: Docente;
  activeTab: any;

  ngOnInit(): void {
    forkJoin({
      asignaciones: this.docenteService.AsignacionDocenteSelfListCurrent(),
    }).subscribe({
      next: ({ asignaciones }) => {
        this.asignaciones = asignaciones;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  navigateToGrupoDetails(id: number) {
    this.router.navigate([id + '/general'], { relativeTo: this.route });
  }
}
