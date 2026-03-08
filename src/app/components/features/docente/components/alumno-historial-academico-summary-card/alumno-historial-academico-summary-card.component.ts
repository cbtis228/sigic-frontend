import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alumno } from '../../../../../interfaces/alumno.interface';
import { CommonModule } from '@angular/common';
import { AlumnoEstatusValuePipe } from "../../../../../pipes/alumno-estatus-value.pipe";

@Component({
  selector: 'app-alumno-historial-academico-summary-card',
  imports: [CommonModule, AlumnoEstatusValuePipe],
  templateUrl: './alumno-historial-academico-summary-card.component.html',
  styleUrl: './alumno-historial-academico-summary-card.component.scss'
})
export class AlumnoHistorialAcademicoSummaryCardComponent {
  @Input() alumno: Alumno | null = null;
  @Output() onHistorialAcademicoClick = new EventEmitter<Alumno>();
}
