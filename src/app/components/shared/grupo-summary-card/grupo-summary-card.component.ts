import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Grupo } from '../../../interfaces/academico.interface';

@Component({
  selector: 'app-grupo-summary-card',
  imports: [CommonModule],
  templateUrl: './grupo-summary-card.component.html',
  styleUrl: './grupo-summary-card.component.scss'
})
export class GrupoSummaryCardComponent {

  @Input() grupo!:  Grupo

}
