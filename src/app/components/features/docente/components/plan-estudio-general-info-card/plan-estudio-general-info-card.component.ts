import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { PlanEstudio } from '../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-plan-estudio-general-info-card',
  imports: [CommonModule, CardWithTitleComponent],
  templateUrl: './plan-estudio-general-info-card.component.html',
  styleUrl: './plan-estudio-general-info-card.component.scss',
})
export class PlanEstudioGeneralInfoCardComponent {
  @Input() planEstudio: PlanEstudio | null = null;
  @Input() loading: boolean = true;

  calculateVigenciaDuration(): string {
    if (!this.planEstudio?.vigencia_inicio || !this.planEstudio?.vigencia_fin) {
      return 'Período no especificado';
    }

    try {
      const inicio = new Date(this.planEstudio.vigencia_inicio);
      const fin = new Date(this.planEstudio.vigencia_fin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));

      return `${diffYears} año${diffYears !== 1 ? 's' : ''}`;
    } catch (error) {
      return 'Período no válido';
    }
  }

  getEstatusClass(estatus: number): string {
    switch (estatus) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEstatusText(estatus: number): string {
    switch (estatus) {
      case 1:
        return 'Activo';
      case 2:
        return 'En revisión';
      case 3:
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  }
}
