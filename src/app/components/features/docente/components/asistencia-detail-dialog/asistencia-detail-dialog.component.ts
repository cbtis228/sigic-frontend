import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Asistencia } from '../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-asistencia-detail-dialog',
  imports: [CommonModule, DialogModule],
  templateUrl: './asistencia-detail-dialog.component.html',
  styleUrl: './asistencia-detail-dialog.component.scss'
})
export class AsistenciaDetailDialogComponent {

  @Input() asistencia: Asistencia | null = null
  @Input() visible: boolean = false
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter()
}
