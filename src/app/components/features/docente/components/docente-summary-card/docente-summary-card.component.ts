import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defaultEstatusValuePipe } from '../../../../../pipes/default-estatus-value.pipe';
import { Docente } from '../../../../../interfaces/docente.interface';

@Component({
  selector: 'app-docente-summary-card',
  standalone: true,
  imports: [CommonModule, defaultEstatusValuePipe],
  templateUrl: './docente-summary-card.component.html',
  styleUrls: ['./docente-summary-card.component.scss']
})
export class DocenteSummaryCardComponent {
  @Input() docente!: Docente;
  @Output() onHorarioDetailClick = new EventEmitter<Docente>();
}
