import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Grupo } from '../../../../../interfaces/academico.interface';
import { defaultEstatusValuePipe } from '../../../../../pipes/default-estatus-value.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupo-summary-card',
  imports: [defaultEstatusValuePipe, CommonModule],
  templateUrl: './grupo-summary-card.component.html',
  styleUrl: './grupo-summary-card.component.scss'
})
export class GrupoSummaryCardComponent {
  @Input() grupo!: Grupo
  @Output() onHorarioDetailClick: EventEmitter<Grupo> = new EventEmitter()
  
}
