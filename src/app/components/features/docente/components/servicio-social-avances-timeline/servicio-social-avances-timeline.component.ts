import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistroHorasServicioSocial } from '../../../../../interfaces/academico.interface';
import { AlumnoGeneralRoutingModule } from '../../../alumno/pages/data/data.routing.module';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-servicio-social-avances-timeline',
  imports: [AlumnoGeneralRoutingModule, CommonModule, ButtonModule],
  templateUrl: './servicio-social-avances-timeline.component.html',
  styleUrl: './servicio-social-avances-timeline.component.scss',
})
export class ServicioSocialAvancesTimelineComponent {
  @Input() registrosServicioSocial: RegistroHorasServicioSocial[] = [];
  @Input() showDeleteButton: boolean | null = false
  @Output()
  onClickDelete: EventEmitter<RegistroHorasServicioSocial> =
    new EventEmitter();
}
