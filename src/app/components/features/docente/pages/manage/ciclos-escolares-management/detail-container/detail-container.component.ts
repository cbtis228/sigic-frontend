import { Component, OnInit } from '@angular/core';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { CicloEscolar } from '../../../../../../../interfaces/academico.interface';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-container',
  imports: [ButtonModule, CommonModule, DatePipe, RouterOutlet, RouterModule],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss',
})
export class DetailContainerComponent implements OnInit {
  cicloEscolar: CicloEscolar | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;
    this.academicoService.CicloEscolarDetailApi(Number(id)).subscribe({
      next: (response) => (this.cicloEscolar = response),
    });
  }

  getEstatusText(estatus: number): string {
    return estatus === 1 ? 'Activo' : 'Inactivo';
  }

  getEstatusClass(estatus: number): string {
    return estatus === 1
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  }

  calculateDuration(fechaInicio: string, fechaFin: string): string {
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30);

    if (diffMonths >= 12) {
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      return `${years} año${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}` : ''}`.trim();
    }

    return `${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
  }

  checkCurrentPeriod(fechaInicio: string, fechaFin: string): string {
    const now = new Date();
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    if (now < start) {
      return 'El ciclo escolar aún no ha comenzado';
    } else if (now > end) {
      return 'El ciclo escolar ha concluido';
    } else {
      return 'El ciclo escolar está en curso';
    }
  }

  getPeriodDescription(status: string): string {
    switch (status) {
      case 'active':
        return 'El ciclo escolar se encuentra actualmente en desarrollo';
      case 'completed':
        return 'El ciclo escolar ha finalizado según las fechas establecidas';
      case 'pending':
        return 'El ciclo escolar está programado para comenzar próximamente';
      default:
        return 'Estado del ciclo escolar desconocido';
    }
  }

  getCicloStatus(fechaInicio: string, fechaFin: string): string {
    const now = new Date();
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    if (now < start) {
      return 'pending'; // No ha comenzado
    } else if (now > end) {
      return 'completed'; // Ya terminó
    } else {
      return 'active'; // En curso
    }
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 '
      case 'completed':
        return 'bg-orange-100 text-orange-800 '
      case 'pending':
        return 'bg-blue-100 text-blue-800 '
      default:
        return 'bg-gray-100 text-gray-800 '
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'En Curso';
      case 'completed':
        return 'Finalizado';
      case 'pending':
        return 'Por Comenzar';
      default:
        return 'Desconocido';
    }
  }

  getCardStatusClass(fechaInicio: string, fechaFin: string): string {
    const status = this.getCicloStatus(fechaInicio, fechaFin);

    switch (status) {
      case 'active':
        return 'border-l-4 border-l-green-500 bg-green-50'; // Borde izquierdo verde
      case 'completed':
        return 'border-l-4 border-l-orange-500 bg-orange-50'; // Borde izquierdo naranja
      case 'pending':
        return 'border-l-4 border-l-blue-500 bg-blue-50'; // Borde izquierdo azul
      default:
        return 'border-l-4 border-l-gray-500 bg-gray-50';
    }
  }
}
