import { Component, Input } from '@angular/core';
import { DatosFacturacion } from '../../../../../interfaces/alumno.interface';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos-facturacion-card',
  imports: [CardWithTitleComponent, CommonModule],
  templateUrl: './datos-facturacion-card.component.html',
  styleUrl: './datos-facturacion-card.component.scss',
})
export class DatosFacturacionCardComponent {
  @Input() datosFacturacion: DatosFacturacion | null = null;
  @Input() loading: boolean = true;
}
