import { Component, Input } from '@angular/core';
import { Materia } from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';

@Component({
  selector: 'app-materia-general-info-card',
  imports: [CommonModule, CardWithTitleComponent],
  templateUrl: './materia-general-info-card.component.html',
  styleUrl: './materia-general-info-card.component.scss'
})
export class MateriaGeneralInfoCardComponent {
  @Input() materia: Materia | null = null;
  @Input() loading: boolean = true;
}
