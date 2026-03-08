import { Component, OnInit } from '@angular/core';
import { AcademicoService } from '../../../../../services/academico.service';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import {
  Grupo,
  Incidencia,
  IncidenciaCreate,
  IncidenciaListFilterRequest,
  IncidenciaUpdate,
} from '../../../../../interfaces/academico.interface';
import { PermissionsService } from '../../../../../services/permissions.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../services/error.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { defaultEstatusValuePipe } from '../../../../../pipes/default-estatus-value.pipe';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ESTADOS_GENERALES,
  GRAVEDAD_INCIDENCIA,
  TIPO_INCIDENCIA,
} from '../../../../../global.constants';
import { SelectModule } from 'primeng/select';
import { IncidenciaCreateDialogComponent } from '../../components/incidencia-create-dialog/incidencia-create-dialog.component';
import { IncidenciaDetailDialogComponent } from '../../components/incidencia-detail-dialog/incidencia-detail-dialog.component';
import { IncidenciaEditDialogComponent } from '../../components/incidencia-edit-dialog/incidencia-edit-dialog.component';
import { Alumno } from '../../../../../interfaces/alumno.interface';
import { AlumnoAutocompleteComponent } from '../../components/alumno-autocomplete/alumno-autocomplete.component';
import { GrupoAutocompleteComponent } from '../../components/grupo-autocomplete/grupo-autocomplete.component';
import { combineLatest, map } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-incidencias',
  imports: [
    AlumnoAutocompleteComponent,
    GrupoAutocompleteComponent,
    TableModule,
    FormsModule,
    ButtonModule,
    CommonModule,
    defaultEstatusValuePipe,
    MenuModule,
    SelectModule,
    IncidenciaCreateDialogComponent,
    DatePickerModule,
    IncidenciaDetailDialogComponent,
    IncidenciaEditDialogComponent,
  ],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.scss',
})
export class IncidenciasComponent implements OnInit {
  incidenciasData: PaginatedData<Incidencia> | null = null;

  tipoFilter: number | null = null;
  globalFilter: string = '';
  gravedadFilter: number | null = null;
  estatusFilter: number | null = null;
  alumnoFilter: Alumno | null = null;
  grupoFilter: Grupo | null = null;
  fechaFilter: Date | null = null;

  tiposIncidencia = TIPO_INCIDENCIA;
  gravedadedIncidencia = GRAVEDAD_INCIDENCIA;
  estatuses = ESTADOS_GENERALES;
  selectedIncidencia: Incidencia | null = null;

  showCreateIncidenciaDialog: boolean = false;
  showDetailIncidenciaDialog: boolean = false;
  showEditIncidenciaDialog: boolean = false;
  menuItems: MenuItem[] = [];

  lastLazyLoadEvent: TableLazyLoadEvent | null = null;
  constructor(
    private academicoService: AcademicoService,
    private messageService: MessageService,
    private errorService: ErrorService,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit() {
    this.academicoService
      .IncidenciaListApi('', '', {} as IncidenciaListFilterRequest, 0, 10)
      .subscribe({
        next: (response) => {
          this.incidenciasData = response;
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

  updateMenuItems(incidencia: Incidencia): void {
    combineLatest([this.permissionsService.has$('academico.change_incidencia')])
      .pipe(
        map(([canChangeIncidencia]) => {
          const items: any[] = [];

          items.push({
            label: 'Detalle',
            icon: 'pi pi-eye',
            command: () => {
              this.showDetailIncidenciaDialog = true;
              this.selectedIncidencia = incidencia;
            },
          });

          if (canChangeIncidencia) {
            items.push({
              label: 'Editar',
              icon: 'pi pi-pencil',
              command: () => {
                this.showEditIncidenciaDialog = true;
                this.selectedIncidencia = incidencia;
              },
            });
          }

          return items;
        }),
      )
      .subscribe((items) => {
        this.menuItems = items;
      });
  }

  onTableEvent(event?: TableLazyLoadEvent) {
    if (event) this.lastLazyLoadEvent = event;
    const filters = {} as IncidenciaListFilterRequest;

    filters.global_filter = this.globalFilter;
    if (this.tipoFilter !== null)
      filters.tipo = [
        { value: this.tipoFilter, matchMode: 'equals', operator: 'and' },
      ];
    if (this.gravedadFilter !== null)
      filters.gravedad = [
        { value: this.gravedadFilter, matchMode: 'equals', operator: 'and' },
      ];
    if (this.estatusFilter !== null)
      filters.estatus = [
        { value: this.estatusFilter, matchMode: 'equals', operator: 'and' },
      ];
    if (this.alumnoFilter !== null)
      filters.inscripcion__alumno__numero_control = [
        {
          value: this.alumnoFilter.numero_control,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    if (this.grupoFilter !== null)
      filters.inscripcion__grupo__id = [
        { value: this.grupoFilter.id, matchMode: 'equals', operator: 'and' },
      ];

    if (this.fechaFilter !== null)
      filters.fecha = [
        {
          value: this.fechaFilter.toISOString().split('T')[0],
          matchMode: 'equals',
          operator: 'and',
        },
      ];

    const orderBy = Array.isArray(this.lastLazyLoadEvent?.sortField)
      ? this.lastLazyLoadEvent?.sortField[0] || ''
      : this.lastLazyLoadEvent?.sortField || '';
    const order = this.lastLazyLoadEvent?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = this.lastLazyLoadEvent?.first || 0;
    const limit = this.lastLazyLoadEvent?.rows || 10;

    this.academicoService
      .IncidenciaListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.incidenciasData = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  clearFilters() {
    this.tipoFilter = null;
    this.globalFilter = '';
    this.gravedadFilter = null;
    this.estatusFilter = null;
    this.alumnoFilter = null;
    this.grupoFilter = null;
    this.fechaFilter = null;
    this.onTableEvent();
  }

  getTipoBadgeClass(tipo: number): string {
    const classes = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-purple-100 text-purple-800',
    };
    return classes[tipo as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getGravedadBadgeClass(gravedad: number): string {
    const classes = {
      1: 'bg-yellow-100 text-yellow-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-red-100 text-red-800',
    };
    return (
      classes[gravedad as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }

  getEstatusBadgeClass(estatus: number): string {
    const classes = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-gray-100 text-gray-800',
      4: 'bg-blue-100 text-blue-800',
    };
    return (
      classes[estatus as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }

  onIncidenciaCreate(incidenciaCreate: IncidenciaCreate) {
    this.academicoService.IncidenciaCreateApi(incidenciaCreate).subscribe({
      next: () => {
        this.showCreateIncidenciaDialog = false;
        this.messageService.add({
          detail: 'Incidencia registrada',
          severity: 'success',
        });
        this.onTableEvent();
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({ detail, severity: 'error' });
      },
    });
  }

  onIncidenciaUpdate(incidenciaUpdate: IncidenciaUpdate) {
    if (!this.selectedIncidencia) return;

    this.academicoService
      .IncidenciaUpdateApi(this.selectedIncidencia.id, incidenciaUpdate)
      .subscribe({
        next: () => {
          this.showEditIncidenciaDialog = false;
          this.messageService.add({
            detail: 'Incidencia actualizada',
            severity: 'success',
          });
          this.onTableEvent();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({ detail, severity: 'error' });
        },
      });
  }
}
