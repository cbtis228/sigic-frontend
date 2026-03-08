import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CicloEscolar } from '../../../interfaces/academico.interface';
import { CardWithTitleComponent } from '../card-with-title/card-with-title.component';

@Component({
  selector: 'app-ciclo-escolar-general-info-card',
  imports: [CardWithTitleComponent, CommonModule],
  templateUrl: './ciclo-escolar-general-info-card.component.html',
  styleUrl: './ciclo-escolar-general-info-card.component.scss',
})
export class CicloEscolaGeneralInfoCardComponent {
  @Input() cicloEscolar: CicloEscolar | null = null;
  @Input() loading: boolean = true;

  calcularDuracion(fechaInicio: string, fechaFin: string): string {
    if (!fechaInicio || !fechaFin) return 'No especificado';

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} días`;
  }

  calcularMeses(fechaInicio: string, fechaFin: string): string {
    if (!fechaInicio || !fechaFin) return '0';

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
    meses -= inicio.getMonth();
    meses += fin.getMonth();

    return meses <= 0 ? '0' : meses.toString();
  }
}
