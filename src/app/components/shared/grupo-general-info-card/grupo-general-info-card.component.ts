import { Component, Input } from '@angular/core';
import { Grupo } from '../../../interfaces/academico.interface';
import { CardWithTitleComponent } from "../card-with-title/card-with-title.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupo-general-info-card',
  imports: [CardWithTitleComponent, CommonModule],
  templateUrl: './grupo-general-info-card.component.html',
  styleUrl: './grupo-general-info-card.component.scss'
})
export class GrupoGeneralInfoCardComponent {
  @Input() grupo: Grupo | null = null;
  @Input() loading: boolean = true;
}
