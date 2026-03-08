import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { combineLatest, map } from 'rxjs';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import {
  AsignacionDocente,
  AsignacionDocenteListFilterRequest,
  AsignacionDocenteCreate,
  AsignacionDocenteUpdate,
  Materia,
  Grupo,
  CicloEscolar,
} from '../../../../../interfaces/academico.interface';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { AcademicoService } from '../../../../../services/academico.service';
import { ErrorService } from '../../../../../services/error.service';
import { PermissionsService } from '../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { MateriaAutocompleteComponent } from '../../components/materia-autocomplete/materia-autocomplete.component';
import { AsignacionDocenteCreateDialogComponent } from '../../components/asignacion-docente-create-dialog/asignacion-docente-create-dialog.component';
import { CicloEscolarAutocompleteComponent } from '../../components/ciclo-escolar-autocomplete/ciclo-escolar-autocomplete.component';
import { AsignacionDocenteEditDialogComponent } from '../../components/asignacion-docente-edit-dialog/asignacion-docente-edit-dialog.component';
import { AsignacionDocenteDetailDialogComponent } from '../../components/asignacion-docente-detail-dialog/asignacion-docente-detail-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InputText, InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-asignacion-docente',
  imports: [
    CommonModule,
    ButtonModule,
    DatePickerModule,
    FormsModule,
    SelectModule,
    MenuModule,
    MateriaAutocompleteComponent,
    TableModule,
    MateriaAutocompleteComponent,
    CicloEscolarAutocompleteComponent,
    AsignacionDocenteCreateDialogComponent,
    AsignacionDocenteEditDialogComponent,
    AsignacionDocenteDetailDialogComponent,
    InputTextModule
  ],
  templateUrl: './asignacion-docente.component.html',
  styleUrl: './asignacion-docente.component.scss',
})
export class AsignacionDocenteComponent implements OnInit {
  asignacionDocenteData: PaginatedData<AsignacionDocente> | null = null;
  selectedAsignacionDocente: AsignacionDocente | null = null;

  globalFilter: string = '';
  materiaFilter: Materia | null = null;
  cicloEscolarFilter: CicloEscolar | null = null;
  grupoFilter: Grupo | null = null;
  estatusFilter: number | null = null;

  estatuses = ESTADOS_GENERALES;
  menuItems: MenuItem[] = [];

  showCreateAsignacionDocenteDialog: boolean = false;
  showDetailAsignacionDocenteDialog: boolean = false;
  showEditAsignacionDocenteDialog: boolean = false;

  lastLazyLoadEvent: TableLazyLoadEvent | null = null;
  constructor(
    public permissionsService: PermissionsService,
    private academicoService: AcademicoService,
    private errorService: ErrorService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.academicoService
      .AsignacionDocenteListApi(
        '',
        '',
        {} as AsignacionDocenteListFilterRequest,
        0,
        10,
      )
      .subscribe({
        next: (response) => {
          this.asignacionDocenteData = response;
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
    const filters = {} as AsignacionDocenteListFilterRequest;

    filters.global_filter = this.globalFilter;
    if (this.estatusFilter !== null)
      filters.estatus = [
        { value: this.estatusFilter, matchMode: 'equals', operator: 'and' },
      ];
    if (this.materiaFilter !== null)
      filters.materia__id = [
        {
          value: this.materiaFilter.id,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    if (this.cicloEscolarFilter !== null)
      filters.ciclo_escolar__id = [
        {
          value: this.cicloEscolarFilter.id,
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
      .AsignacionDocenteListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.asignacionDocenteData = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  getEstatusBadgeClass(estatus: number): string {
    const classes = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
    };
    return (
      classes[estatus as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }
  updateMenuItems(asignacionDocente: AsignacionDocente): void {
    combineLatest([
      this.permissionsService.has$('academico.change_serviciosocial'),
      this.permissionsService.has$('academico.view_asistencia'),
    ])
      .pipe(
        map(([canChangeAsignacionDocente, canViewAsistencia]) => {
          const items: any[] = [];

          items.push({
            label: 'Detalle',
            icon: 'pi pi-eye',
            command: () => {
              this.showDetailAsignacionDocenteDialog = true;
              this.selectedAsignacionDocente = asignacionDocente;
            },
          });

          if (canChangeAsignacionDocente) {
            items.push({
              label: 'Editar',
              icon: 'pi pi-pencil',
              command: () => {
                this.showEditAsignacionDocenteDialog = true;
                this.selectedAsignacionDocente = asignacionDocente;
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

  clearFilters() {
    this.globalFilter = '';
    this.estatusFilter = null;
    this.grupoFilter = null;
    this.cicloEscolarFilter = null;
    this.materiaFilter = null;
    this.onTableEvent();
  }

  onAsignacionDocenteCreate(asignacionDocenteCreate: AsignacionDocenteCreate) {
    this.academicoService
      .AsignacionDocenteCreateApi(asignacionDocenteCreate)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Servicio social creado exitosamente',
          });
          this.showCreateAsignacionDocenteDialog = false;
          this.onTableEvent();
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
  onAsignacionDocenteUpdate(asignacionDocenteUpdate: AsignacionDocenteUpdate) {
    if (!this.selectedAsignacionDocente) return;
    this.academicoService
      .AsignacionDocenteUpdateApi(
        this.selectedAsignacionDocente.id,
        asignacionDocenteUpdate,
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Asignacion docente actualizada exitosamente',
          });
          this.showEditAsignacionDocenteDialog = false;
          this.selectedAsignacionDocente = null;
          this.onTableEvent();
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
}
