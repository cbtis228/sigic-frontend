import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TIPO_ASISTENCIA } from '../../../../../global.constants';
import {
  Asistencia,
  AsistenciaListFilterRequest,
  AsignacionDocente,
} from '../../../../../interfaces/academico.interface';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { AcademicoService } from '../../../../../services/academico.service';
import { ErrorService } from '../../../../../services/error.service';
import { AlumnoAutocompleteComponent } from '../../components/alumno-autocomplete/alumno-autocomplete.component';
import { Alumno } from '../../../../../interfaces/alumno.interface';
import { DialogModule } from 'primeng/dialog';
import { AsistenciaDetailDialogComponent } from '../../components/asistencia-detail-dialog/asistencia-detail-dialog.component';

@Component({
  selector: 'app-asistencias',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    DatePickerModule,
    FormsModule,
    SelectModule,
    MenuModule,
    TableModule,
    AlumnoAutocompleteComponent,
    AsistenciaDetailDialogComponent,
  ],
  templateUrl: './asistencias.component.html',
  styleUrl: './asistencias.component.scss',
})
export class AsistenciasComponent {
  asistenciaData: PaginatedData<Asistencia> | null = null;
  selectedAsistencia: Asistencia | null = null;

  globalFilter: string = '';
  asignacionDocenteFilter: AsignacionDocente | null = null;
  fechaFilter: Date | null = null;
  alumnoFilter: Alumno | null = null;
  tipoFilter: number | null = null;
  tiposAsistencia = TIPO_ASISTENCIA;

  menuItems: MenuItem[] = [];
  showDetailDialog = false;

  lastLazyLoadEvent: TableLazyLoadEvent | null = null;
  constructor(
    private academicoService: AcademicoService,
    private errorService: ErrorService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.academicoService
      .AsistenciaListApi('', '', {} as AsistenciaListFilterRequest, 0, 10)
      .subscribe({
        next: (response) => {
          this.asistenciaData = response;
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

  onTableEvent(event?: TableLazyLoadEvent) {
    if (event) this.lastLazyLoadEvent = event;
    const filters = {} as AsistenciaListFilterRequest;

    filters.global_filter = this.globalFilter;
    if (this.tipoFilter !== null)
      filters.tipo = [
        { value: this.tipoFilter, matchMode: 'equals', operator: 'and' },
      ];
    if (this.asignacionDocenteFilter !== null)
      filters.horario__id = [
        {
          value: this.asignacionDocenteFilter.id,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    if (this.alumnoFilter !== null)
      filters.alumno__numero_control = [
        {
          value: this.alumnoFilter.numero_control,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    if (this.fechaFilter !== null) {
      const formattedDate = this.fechaFilter.toISOString().split('T')[0];
      filters.fecha = [
        {
          value: formattedDate,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    }
    const orderBy = Array.isArray(this.lastLazyLoadEvent?.sortField)
      ? this.lastLazyLoadEvent?.sortField[0] || ''
      : this.lastLazyLoadEvent?.sortField || '';
    const order = this.lastLazyLoadEvent?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = this.lastLazyLoadEvent?.first || 0;
    const limit = this.lastLazyLoadEvent?.rows || 10;

    this.academicoService
      .AsistenciaListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.asistenciaData = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  getTipoBadgeClass(estatus: number): string {
    const classes = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-red-100 text-red-800',
      4: 'bg-blue-100 text-blue-800',
    };
    return (
      classes[estatus as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }

  clearFilters() {
    this.globalFilter = '';
    this.tipoFilter = null;
    this.alumnoFilter = null;
    this.fechaFilter = null;
    this.asignacionDocenteFilter = null;
    this.onTableEvent();
  }
}
