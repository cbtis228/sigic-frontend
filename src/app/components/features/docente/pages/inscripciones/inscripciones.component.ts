import { Component, OnInit } from '@angular/core';
import { AcademicoService } from '../../../../../services/academico.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import * as Papa from 'papaparse';
import {
  CicloEscolar,
  CicloEscolarListFilterRequest,
  Grupo,
  Inscripcion,
  InscripcionBulkCreate,
  InscripcionBulkCreateResponse,
  InscripcionCreate,
  InscripcionListFilterRequest,
} from '../../../../../interfaces/academico.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Alumno } from '../../../../../interfaces/alumno.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorService } from '../../../../../services/error.service';
import { AlumnoInscripcionCardComponent } from '../../components/alumno-inscripcion-card/alumno-inscripcion-card.component';
import { AlumnoInscripcionDetailDialogComponent } from '../../components/alumno-inscripcion-detail-dialog/alumno-inscripcion-detail-dialog.component';
import { AlumnoInscripcionCreateDialogComponent } from '../../components/alumno-inscripcion-create-dialog/alumno-inscripcion-create-dialog.component';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { PermissionsService } from '../../../../../services/permissions.service';

@Component({
  selector: 'app-inscripciones',
  imports: [
    DialogModule,
    ConfirmDialog,
    FileUploadModule,
    AlumnoInscripcionDetailDialogComponent,
    ReactiveFormsModule,
    DatePickerModule,
    ButtonModule,
    AlumnoInscripcionCardComponent,
    PaginatorModule,
    CommonModule,
    AutoCompleteModule,
    AlumnoInscripcionCreateDialogComponent,
    InputTextModule,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './inscripciones.component.html',
  styleUrl: './inscripciones.component.scss',
})
export class InscripcionesComponent implements OnInit {
  showCreateInscripcionDialog: boolean = false;
  showDetailInscripcionDialog: boolean = false;
  grupos: Grupo[] = [];
  ciclosEscolares: CicloEscolar[] = [];
  cicloEscolar: CicloEscolar | null = null;
  today: Date = new Date();
  inscripcionForm: FormGroup;
  inscripcionesData: PaginatedData<Inscripcion> | null = null;
  alumnos: Alumno[] = [];
  grupoSeleccionado: Grupo | null = null;
  estatuses = ESTADOS_GENERALES;
  estatusFilter: number | null = null;
  globalFilter: string = '';
  selectedInscription: Inscripcion | null = null;

  constructor(
    private academicoService: AcademicoService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private confirmationService: ConfirmationService,
    public permissionsService: PermissionsService,
    private fb: FormBuilder,
  ) {
    this.inscripcionForm = this.fb.group({
      alumno: [null, Validators.required],
      grupo: [null, Validators.required],
      fecha_inscripcion: [new Date()],
      observaciones: [''],
    });
  }

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
          this.loadInscripciones();
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

  loadInscripciones(event?: PaginatorState): void {
    const filtersInscripciones = {
      grupo__ciclo_escolar__id: [
        {
          value: this.cicloEscolar!.id,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      global_filter: this.globalFilter,
    } as InscripcionListFilterRequest;

    if (this.estatusFilter) {
      filtersInscripciones.estatus = [
        { value: this.estatusFilter, matchMode: 'equals', operator: 'and' },
      ];
    }
    const limit = event?.rows || 10;
    const offset = event?.first || 0;

    this.academicoService
      .InscripcionListApi('', '', filtersInscripciones, offset, limit)
      .subscribe({
        next: (response) => {
          this.inscripcionesData = response;
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

  downloadTemplate(): void {
    const csvContent = [
      'numero_control,grupo_id,fecha_inscripcion,observaciones',
      '2500381,15,2025-05-10,Alumno regular sin adeudos',
      '2501773,15,2025-05-11,Reinscripción tardía',
      '2501988,15,2025-05-12,Nuevo ingreso',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_inscripciones.csv';
    link.click();

    URL.revokeObjectURL(url);
  }

  onInscripcionCreate(event: InscripcionCreate): void {
    this.academicoService.InscripcionCreateApi(event).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Alumno inscrito',
        });
        this.loadInscripciones();
        this.showCreateInscripcionDialog = false;
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          severity: 'error',
          detail,
        });
      },
    });
  }

  onCicloChange(): void {
    this.loadInscripciones();
  }

  onDetailInscripcionClick(inscripcion: Inscripcion): void {
    this.selectedInscription = inscripcion;
    this.showDetailInscripcionDialog = true;
  }

  deactivateInscripcion(inscripcion: Inscripcion): void {
    this.academicoService
      .InscripcionUpdateApi(inscripcion.id, { estatus: 2 })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Inscripcion suspendida correctamente',
          });
          this.loadInscripciones();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({ severity: 'error', detail });
        },
      });
  }

  onActivateInscripcionClick(inscripcion: Inscripcion): void {
    this.academicoService
      .InscripcionUpdateApi(inscripcion.id, { estatus: 1 })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Inscripcion activada correctamente',
          });
          this.loadInscripciones();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({ severity: 'error', detail });
        },
      });
  }


  onDeactivateInscripcionClick(inscripcion: Inscripcion): void {
    this.confirmationService.confirm({
      header: 'Confirmar suspensión de inscripción',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sí, suspender',
        severity: 'danger',
      },
      accept: () => {
        this.deactivateInscripcion(inscripcion);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'La inscripción no ha sido suspendida',
          life: 3000,
        });
      },
    });
  }

  onUpload(event: FileUploadHandlerEvent) {
    const file: File = event.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const requiredHeaders = [
          'numero_control',
          'grupo_id',
          'fecha_inscripcion',
          'observaciones',
        ];

        const headers: string[] = results.meta.fields || [];

        const missing = requiredHeaders.filter((h) => !headers.includes(h));

        if (missing.length > 0) {
          this.messageService.add({
            detail: 'Faltan columnas en el CSV: ' + missing,
            severity: 'error',
          });
          return;
        }

        const extra = headers.filter((h) => !requiredHeaders.includes(h));
        if (extra.length > 0) {
          this.messageService.add({
            detail: 'Columnas adicionales detectadas: ' + extra,
            severity: 'error',
          });
        }

        const inscripciones = (results.data as any[]).map((row) => ({
          alumno: row['numero_control'],
          grupo: Number(row['grupo_id']),
          fecha_inscripcion: row['fecha_inscripcion'] || undefined,
          observaciones: row['observaciones'] || undefined,
        }));

        this.bulkCreateInscripciones({ inscripciones_data: inscripciones });
      },
      error: (err) => {
        console.error('Error al leer CSV: ', err);
      },
    });
  }

  bulkCreateInscripciones(inscripciones_data: InscripcionBulkCreate) {
    this.academicoService
      .InscripcionBulkCreateApi(inscripciones_data)
      .subscribe({
        next: (response) => {
          this.loadInscripciones();
          this.downloadResultsCsv(response);
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({ detail, severity: 'error' });
        },
      });
  }

  downloadResultsCsv(data: InscripcionBulkCreateResponse) {
    let csvContent = 'INSCRIPCIONES EXITOSAS\n';
    csvContent += 'Alumno,Grupo\n';

    for (const id of data.inscripciones_exitosas) {
      csvContent += `Alumno_${id},Grupo_${id}\n`;
    }

    csvContent += '\nINSCRIPCIONES FALLIDAS\n';
    csvContent += 'Alumno,Grupo,Error\n';

    for (const failed of data.inscripciones_fallidas) {
      failed.detail = JSON.parse(failed.detail);
      csvContent += `${failed.data.alumno},${failed.data.grupo},"${this.errorService.formatError(failed)}"\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'resultados_inscripciones.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onDialogInscripcionAlumnoHide() {}
}
