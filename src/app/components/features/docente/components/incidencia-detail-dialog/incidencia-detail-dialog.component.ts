import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Incidencia } from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incidencia-detail-dialog',
  imports: [DialogModule, CommonModule],
  templateUrl: './incidencia-detail-dialog.component.html',
  styleUrl: './incidencia-detail-dialog.component.scss'
})
export class IncidenciaDetailDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Input() incidencia: Incidencia | null = null;

}

