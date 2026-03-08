import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { ContactoEmergencia } from '../../../../../interfaces/alumno.interface';

@Component({
  selector: 'app-contacto-emergencia-card',
  imports: [CommonModule, CardWithTitleComponent],
  templateUrl: './contacto-emergencia-card.component.html',
  styleUrl: './contacto-emergencia-card.component.scss',
})
export class ContactoEmergenciaCardComponent {
  @Input() contactoEmergencia: ContactoEmergencia | null = null;
  @Input() loading: boolean = true;
  @Input() numero_contacto: number = 1;
}
