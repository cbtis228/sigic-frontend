import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { Docente } from '../../../../../interfaces/docente.interface';

@Component({
  selector: 'app-docente-general-info-card',
  imports: [CommonModule, CardWithTitleComponent],
  templateUrl: './general-info-card.component.html',
  styleUrl: './general-info-card.component.scss',
})
export class DocenteGeneralInfoCardComponent {
  @Input() docente: Docente | null = null;
  @Input() loading: boolean = true;
}
