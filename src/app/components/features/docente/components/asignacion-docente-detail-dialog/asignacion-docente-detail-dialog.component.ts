import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsignacionDocente } from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-asignacion-docente-detail-dialog',
  imports: [DialogModule, CommonModule],
  
  templateUrl: './asignacion-docente-detail-dialog.component.html',
  styleUrl: './asignacion-docente-detail-dialog.component.scss'
})
export class AsignacionDocenteDetailDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() asignacion: AsignacionDocente | null = null;
}
