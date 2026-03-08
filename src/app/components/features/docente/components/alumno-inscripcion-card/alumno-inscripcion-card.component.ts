import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Inscripcion } from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { defaultEstatusValuePipe } from '../../../../../pipes/default-estatus-value.pipe';
import { PermissionsService } from '../../../../../services/permissions.service';

@Component({
  selector: 'app-alumno-inscripcion-card',
  imports: [CommonModule, defaultEstatusValuePipe],
  templateUrl: './alumno-inscripcion-card.component.html',
  styleUrl: './alumno-inscripcion-card.component.scss'
})
export class AlumnoInscripcionCardComponent {

  constructor(public permissionsService: PermissionsService){}

  @Input() inscripcion!: Inscripcion
  @Output() onDeactivateClick: EventEmitter<Inscripcion> = new EventEmitter()
  @Output() onActivateClick: EventEmitter<Inscripcion> = new EventEmitter()
  @Output() onDetailClick: EventEmitter<Inscripcion> = new EventEmitter()

}
