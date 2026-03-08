import { Component, ViewChild } from '@angular/core';
import { AcademicoService } from '../../../../../../services/academico.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaginatedData } from '../../../../../../interfaces/paginated-data.interface';
import {
  Grupo,
  GrupoListFilterRequest,
} from '../../../../../../interfaces/academico.interface';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { debounceTime, Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { defaultEstatusValuePipe } from '../../../../../../pipes/default-estatus-value.pipe';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ESTADOS_GENERALES } from '../../../../../../global.constants';
import { SelectModule } from 'primeng/select';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-grupos-management',
  imports: [
    RouterModule,
    defaultEstatusValuePipe,
    MenuModule,
    InputIconModule,
    ButtonModule,
    TableModule,
    CommonModule,
    InputTextModule,
    TagModule,
    PopoverModule,
    IconFieldModule,
    SelectModule
  ],
  templateUrl: './grupos-management.component.html',
  styleUrl: './grupos-management.component.scss',
})
export class GruposManagementComponent {
  constructor(
    private academicoService: AcademicoService,
    private router: Router,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService
  ) {}

  grupoData: PaginatedData<Grupo> | null = null;
  showCreateDocenteDialog: boolean = false;
  menuItems: MenuItem[] = [];
  estatuses = ESTADOS_GENERALES

  @ViewChild('dt') dt!: Table;
  private filterSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.academicoService.GrupoListApi().subscribe({
      next: (response) => {
        this.grupoData = response;
      },
    });
    this.filterSubject.pipe(debounceTime(100)).subscribe((value) => {
      this.dt.filterGlobal(value, 'contains');
    });
  }
  onGlobalFilterChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterSubject.next(inputElement.value);
  }

  updateMenuItems(grupo: Grupo): void {
    this.menuItems = [
      {
        label: 'Información General',
        icon: 'pi pi-users',
        command: () => {
          this.router.navigate([`${grupo.id}/general`], {
            relativeTo: this.route,
          });
        },
      },
    ];
  }

  onDetail(id: string): void {
    this.router.navigate([id, 'detail'], {
      relativeTo: this.route,
    });
  }

  onTableEvent(event?: TableLazyLoadEvent) {
    const globalFilter = Array.isArray(event?.filters?.['global'])
      ? event?.filters?.['global'][0]?.value || ''
      : event?.filters?.['global']?.value || '';

    const filters = {
      global_filter: globalFilter || '',
      ...event?.filters,
    } as GrupoListFilterRequest;
    const orderBy = Array.isArray(event?.sortField)
      ? event?.sortField[0] || ''
      : event?.sortField || '';

    const order = event?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = event?.first || 0;
    const limit = event?.rows || 10;

    this.academicoService
      .GrupoListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.grupoData = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getSeverity(estatus: number): 'success' | 'info' | 'danger' | 'warn' {
    switch (estatus) {
      case 1:
        return 'success';
      case 2:
        return 'danger';
      case 3:
        return 'info';
    }
    return 'warn';
  }
}
