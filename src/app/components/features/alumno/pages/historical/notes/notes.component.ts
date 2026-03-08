import { Component, OnInit } from '@angular/core';
import {
  AlumnoHistorialAcademico,
  AlumnoInscripcion,
} from '../../../../../../interfaces/alumno.interface';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { CardWithTitleComponent } from '../../../../../shared/card-with-title/card-with-title.component';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../services/error.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  imports: [
    CardWithTitleComponent,
    CommonModule,
    SelectModule,

    TableModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent implements OnInit {
  inscripciones: AlumnoInscripcion[] = [];
  selectedInscripcion: AlumnoInscripcion['id'] | null = null;
  historial: AlumnoHistorialAcademico[] | null = null;

  constructor(
    private alumnosService: AlumnosService,
    private messageService: MessageService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.alumnosService.InscripcionSelfListApi().subscribe({
      next: (data) => {
        this.inscripciones = data;
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

  showNotes() {
    this.alumnosService
      .HistorialSelfListByInscripcionApi(this.selectedInscripcion!)
      .subscribe({
        next: (data) => {
          this.historial = data;
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

  get promedio(): number {
    if (this.historial?.length === 0) return 0;
    const validRecords = this.historial?.filter(
      (record) => record.estatus_historial !== 3,
    );
    if (!validRecords) return 0;
    if (validRecords.length === 0) return 0;
    const total = validRecords.reduce(
      (sum, record) => sum + (record.calificacion || 0),
      0,
    );
    return total / validRecords.length;
  }

  getCalificacionClass(calificacion: number): string {
    if (!calificacion && calificacion !== 0) return 'bg-gray-100 text-gray-800';

    if (calificacion >= 9) return 'bg-green-100 text-green-800';
    if (calificacion >= 8) return 'bg-blue-100 text-blue-800';
    if (calificacion >= 7) return 'bg-yellow-100 text-yellow-800';
    if (calificacion < 7) return 'bg-red-100 text-red-800';
    return 'bg-red-100 text-red-800';
  }
  getPromedioClass(promedio: number): string {
    if (!promedio || promedio === 0) return 'bg-gray-100 text-gray-800';

    if (promedio >= 9)
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
    if (promedio >= 8)
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    if (promedio >= 7)
      return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white';
    return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
  }
}
