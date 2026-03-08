import { Component, OnInit } from '@angular/core';
import { CardWithTitleComponent } from '../../../../../shared/card-with-title/card-with-title.component';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { AlumnoServicioSocial } from '../../../../../../interfaces/alumno.interface';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../services/error.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicio-social',
  imports: [CardWithTitleComponent, CommonModule],
  templateUrl: './servicio-social.component.html',
  styleUrl: './servicio-social.component.scss',
})
export class ServicioSocialComponent implements OnInit {
  servicioSocial: AlumnoServicioSocial | null = null;

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.alumnoService.ServicioSocialSelfGetApi().subscribe({
      next: (data) => {
        this.servicioSocial = data;
        if (!data) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Todavia no se registra ningun servicio social',
          });
        }
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail,
        });
      },
    });
  }
}
