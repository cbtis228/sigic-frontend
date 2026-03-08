import { Component, OnInit } from '@angular/core';
import {
  CicloEscolar,
  CicloEscolarListFilterRequest,
  HistorialAcademicoByAlumno,
} from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { AcademicoService } from '../../../../../services/academico.service';
import { ErrorService } from '../../../../../services/error.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DownloadCardComponent } from '../../components/download-card/download-card.component';
import { firstValueFrom } from 'rxjs';
import { FileManagerService } from '../../../../../services/fileManager.service';

@Component({
  selector: 'app-downloads',
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    DownloadCardComponent,
  ],
  templateUrl: './downloads.component.html',
  styleUrl: './downloads.component.scss',
})
export class DownloadsComponent implements OnInit {
  today = new Date();

  cicloEscolar: CicloEscolar | null = null;

  ciclosEscolares: CicloEscolar[] = [];

  historialAcademicoCardTitle = 'Historiales académicos';
  historialAcadermicoCardDescription =
    'Lista completa de los historiales académicos de los alumnos en el ciclo escolar.';
  historialAcademico: HistorialAcademicoByAlumno[] = [];

  historialAcademicoCardBulletPoints = [
    'Información personal completa',
    'Grupo asignado',
    'Calificaciones por materia',
  ];

  constructor(
    private academicoService: AcademicoService,
    private errorService: ErrorService,
    private messageService: MessageService,
    private fileManager: FileManagerService
  ) {}

  ngOnInit() {
    this.academicoService
      .CicloEscolarListApi('', '', {} as CicloEscolarListFilterRequest, 0, 50)
      .subscribe({
        next: (response) => {
          this.ciclosEscolares = response.results;
          this.cicloEscolar =
            this.ciclosEscolares.find((c) => {
              const inicio = new Date(c.fecha_inicio);
              const fin = new Date(c.fecha_fin);
              return this.today >= inicio && this.today <= fin;
            }) || null;
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  async downloadHistorialAcademicoCSV() {
    await this.loadHistorialAcademicoByCiclo();
    if (!this.historialAcademico || this.historialAcademico.length === 0) {
      console.warn('No hay datos para descargar');
      return;
    }

    const headers = [
      'numero_control',
      'nombres',
      'paterno',
      'materno',
      'clave_materia',
      'calificacion',
      'nombre_grupo',
      'estatus_historial',
    ];

    const rows = this.historialAcademico.map((item) => {
      const calificacion =
        item.calificacion !== null && item.calificacion !== undefined
          ? item.calificacion
          : 'SIN CALIFICACION';

      return [
        item.inscripcion.alumno.numero_control || '',
        item.inscripcion.alumno.nombres || '',
        item.inscripcion.alumno.paterno || '',
        item.inscripcion.alumno.materno || '',
        item.materia.clave || '',
        calificacion,
        item.inscripcion.grupo.nombre_grupo || '',
        item.estatus_historial_display || '',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => this.fileManager.escapeCSV(cell)).join(',')), // Filas
    ].join('\n');

    this.fileManager.downloadFile(
      csvContent,
      'historial-academico.csv',
      'text/csv;charset=utf-8;'
    );
  }


  async loadHistorialAcademicoByCiclo(): Promise<void> {
    if (!this.cicloEscolar) {
      throw new Error('No hay ciclo escolar seleccionado');
    }

    try {
      const response = await firstValueFrom(
        this.academicoService.HistorialAcademicoByCicloEscolarApi(
          this.cicloEscolar.id
        )
      );

      this.historialAcademico = response;
    } catch (error) {
      console.error(error);
      const detail = this.errorService.formatError(error);
      this.messageService.add({
        severity: 'error',
        detail,
      });
      throw error;
    }
  }
}
