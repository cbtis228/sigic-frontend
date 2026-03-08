import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Inscripcion } from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-alumno-inscripcion-detail-dialog',
  imports: [CommonModule, DialogModule],
  templateUrl: './alumno-inscripcion-detail-dialog.component.html',
  styleUrl: './alumno-inscripcion-detail-dialog.component.scss'
})
export class AlumnoInscripcionDetailDialogComponent {
  @Input() inscripcion: Inscripcion | null = null
  @Input() visible: boolean = false
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter()

}
