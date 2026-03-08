import { Component, OnInit } from '@angular/core';
import { AcademicoService } from '../../../../../../services/academico.service';
import {
  AlumnoInRisk,
  AlumnoInRiskListFilterRequest,
  CicloEscolar,
  CicloEscolarListFilterRequest,
  Grupo,
} from '../../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../../../../../../services/permissions.service';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from '../../../../../../services/error.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PaginatedData } from '../../../../../../interfaces/paginated-data.interface';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { HistorialAcademicoEstatusSeverityPipe } from '../../../../../../pipes/historia-academico-estatus-severity.pipe';
import { AlumnoGeneralRoutingModule } from '../../../../alumno/pages/data/data.routing.module';
import { Alumno } from '../../../../../../interfaces/alumno.interface';
import { AlumnoAutocompleteComponent } from '../../../components/alumno-autocomplete/alumno-autocomplete.component';
import { GrupoAutocompleteComponent } from '../../../components/grupo-autocomplete/grupo-autocomplete.component';
import { firstValueFrom } from 'rxjs';
import { FileManagerService } from '../../../../../../services/fileManager.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-academicos',
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    HistorialAcademicoEstatusSeverityPipe,
    ConfirmDialogModule,
    AlumnoAutocompleteComponent,
    GrupoAutocompleteComponent,
    AlumnoGeneralRoutingModule,
  ],
  templateUrl: './academicos.component.html',
  styleUrl: './academicos.component.scss',
})
export class AcademicosComponent implements OnInit {
  today = new Date();
  cicloEscolar: CicloEscolar | null = null;
  ciclosEscolares: CicloEscolar[] = [];
  alumnoFilter: Alumno | null = null;
  grupoFilter: Grupo | null = null;
  globalFilter: string = '';

  alumnosInRiskData: PaginatedData<AlumnoInRisk> | null = null;

  constructor(
    private academicoService: AcademicoService,
    private errorService: ErrorService,
    private messageService: MessageService,
    private fileManager: FileManagerService,
    private confirmationService: ConfirmationService,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
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
          this.loadReport();
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

  loadReport(): void {
    this.academicoService.AlumnoInRiskListApi(this.cicloEscolar!.id).subscribe({
      next: (response) => {
        this.alumnosInRiskData = response;
      },
    });
  }

  onCicloChange(): void {
    this.onTableEvent();
  }

  async loadAllAlumnosInRisk(): Promise<AlumnoInRisk[]> {
    if (!this.cicloEscolar) {
      throw new Error('No hay ciclo escolar seleccionado');
    }

    try {
      const response = await firstValueFrom(
        this.academicoService.AlumnoInRiskAllApi(this.cicloEscolar!.id)
      );

      return response;
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

  onTableEvent(event?: TableLazyLoadEvent) {
    const filters = {
      global_filter: this.globalFilter || '',
      ...event?.filters,
    } as AlumnoInRiskListFilterRequest;
    const orderBy = Array.isArray(event?.sortField)
      ? event?.sortField[0] || ''
      : event?.sortField || '';

    if (this.alumnoFilter) {
      filters.alumno__numero_control = [
        {
          value: this.alumnoFilter.numero_control,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    }
    if (this.grupoFilter) {
      filters.grupo__id = [
        { value: this.grupoFilter.id, matchMode: 'equals', operator: 'and' },
      ];
    }

    const order = event?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = event?.first || 0;
    const limit = event?.rows || 10;

    this.academicoService
      .AlumnoInRiskListApi(
        this.cicloEscolar!.id,
        orderBy,
        order,
        filters,
        offset,
        limit
      )
      .subscribe({
        next: (response) => {
          this.alumnosInRiskData = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getSeverityFromRazon(razon: string): 'warn' | 'danger' | 'info' {
    switch (razon) {
      case 'Inscripción inactiva':
        return 'danger';
      case 'Materia(s) reprobada(s)':
        return 'warn';
      default:
        return 'info';
    }
  }

  onDownloadCSVClick(): void {
    this.confirmationService.confirm({
      header: 'Confirmar descarga de información',
      message:
        'Se descargará toda la información disponible en formato CSV. <br>' +
        'Este proceso puede tardar algunos minutos dependiendo del volumen de datos. <br> ' +
        '¿Desea continuar?',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sí, descargar',
        severity: 'primary',
      },
      accept: () => {
        this.exportToCSV();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Descarga cancelada',
          detail: 'La descarga del archivo CSV fue cancelada por el usuario.',
          life: 3000,
        });
      },
    });
  }

  async exportToCSV() {
    const data = await this.loadAllAlumnosInRisk();
    if (
      !this.alumnosInRiskData ||
      this.alumnosInRiskData.results.length === 0
    ) {
      console.warn('No hay datos para descargar');
      return;
    }

    const headers = [
      'numero_control',
      'nombres',
      'paterno',
      'materno',
      'materias_reprobadas',
      'grupo',
      'razon',
    ];

    const rows = data.map((item) => {
      const materiasReprobadas = item.historial_academico
        .map((i) => {
          return `${i.materia.clave}-${i.calificacion || 'Sin Calificar'}`;
        })
        .join(' | ');

      return [
        item.numero_control,
        item.nombres,
        item.paterno,
        item.materno,
        materiasReprobadas,
        item.inscripcion.grupo?.nombre_grupo,
        item.razon,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => this.fileManager.escapeCSV(cell)).join(',')
      ), // Filas
    ].join('\n');

    this.fileManager.downloadFile(
      csvContent,
      'historial-academico.csv',
      'text/csv;charset=utf-8;'
    );
  }

  clearFilters() {
    this.globalFilter = '';
    this.alumnoFilter = null;
    this.grupoFilter = null;
    this.onTableEvent();
  }
}
