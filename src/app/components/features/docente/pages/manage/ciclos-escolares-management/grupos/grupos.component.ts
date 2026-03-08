import { Component } from '@angular/core';
import {
  Grupo,
  GrupoListFilterRequest,
} from '../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GrupoSummaryCardComponent } from '../../../../../../shared/grupo-summary-card/grupo-summary-card.component';

@Component({
  selector: 'app-grupos',
  imports: [CommonModule, RouterModule, GrupoSummaryCardComponent],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.scss',
})
export class GruposComponent {
  grupos: Grupo[] = [];

  constructor(
    private academicoService: AcademicoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadGrupos();
  }

  loadGrupos(): void {
    const idCiclo = this.route.parent?.snapshot.paramMap.get('id');
    if (!idCiclo) return;
    const filters = {
      ciclo_escolar__id: [
        { value: idCiclo, matchMode: 'equals', operator: 'and' },
      ],
    } as GrupoListFilterRequest;
    this.academicoService.GrupoListApi('', '', filters, 0, 1000).subscribe({
      next: (response) => {
        this.grupos = response.results;
      },
      error: (error) => {
        console.error('Error loading grupos:', error);
      },
    });
  }
  get gruposActivos(): number {
    return this.grupos.filter((grupo) => grupo.estatus === 1).length;
  }

  get gruposConCupo(): number {
    return this.grupos.filter((grupo) => grupo.estatus === 1).length;
  }

  get gruposLlenos(): number {
    return 0;
  }

  calcularOcupacion(grupo: Grupo): number {
    return 50;
  }
}
