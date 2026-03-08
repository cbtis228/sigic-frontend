import { Component, Input } from '@angular/core';
import { Alumno } from '../../../../../interfaces/alumno.interface';
import { CommonModule } from '@angular/common';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';

@Component({
  selector: 'app-alumno-general-info-card',
  imports: [CommonModule, CardWithTitleComponent],
  templateUrl: './alumno-general-info-card.component.html',
  styleUrl: './alumno-general-info-card.component.scss',
})
export class AlumnoGeneralInfoCardComponent {
  @Input() alumno: Alumno | null = null;
  @Input() loading: boolean = true;
}
