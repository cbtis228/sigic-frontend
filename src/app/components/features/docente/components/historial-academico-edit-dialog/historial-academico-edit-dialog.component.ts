import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HistorialAcademicoByAlumno, HistorialAcademicoUpdate } from '../../../../../interfaces/academico.interface';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-historial-academico-edit-dialog',
  templateUrl: './historial-academico-edit-dialog.component.html',
  styleUrls: ['./historial-academico-edit-dialog.component.scss'],
  imports: [
    DialogModule,
    InputNumber,
    ButtonModule,
    SelectModule,
    CommonModule,
    FormsModule,
  ],
})
export class HistorialAcademicoEditDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Input() historialAcademico!: HistorialAcademicoByAlumno;

  @Output() onClose: EventEmitter<void> = new EventEmitter();
  @Output() onSave: EventEmitter<HistorialAcademicoUpdate> =
    new EventEmitter();

  calificacion!: number;
  estatus_historial!: number;

  ngOnChanges() {
    if (this.historialAcademico) {
      this.calificacion = this.historialAcademico.calificacion ?? 0;
      this.estatus_historial = this.historialAcademico.estatus_historial;
    }
  }

  save() {
    const updated = {
      calificacion: this.calificacion,
    } as HistorialAcademicoUpdate
    this.onSave.emit(updated);
  }
}
