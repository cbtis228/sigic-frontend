import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { MenuModule } from 'primeng/menu';
import { TableModule, Table, TableLazyLoadEvent } from 'primeng/table';
import { Subject, debounceTime } from 'rxjs';
import {
  CicloEscolar,
  CicloEscolarListFilterRequest,
} from '../../../../../../interfaces/academico.interface';
import { PaginatedData } from '../../../../../../interfaces/paginated-data.interface';
import { AcademicoService } from '../../../../../../services/academico.service';
import { OverlayModule } from 'primeng/overlay';
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { defaultEstatusValuePipe } from '../../../../../../pipes/default-estatus-value.pipe';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-ciclos-escolares-management',
  imports: [
    MenuModule,
    TableModule,
    IconFieldModule,
    CommonModule,
    defaultEstatusValuePipe,
    IconFieldModule,
    OverlayModule,
    PopoverModule,
    InputTextModule,
    InputIconModule,
    RouterModule,
    SplitButtonModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './ciclos-escolares-management.component.html',
  styleUrl: './ciclos-escolares-management.component.scss',
})
export class CiclosEscolaresManagementComponent {
  constructor(
    private academicoService: AcademicoService,
    private router: Router,
    public permissionsService: PermissionsService,
    private route: ActivatedRoute
  ) {}

  cicloEscolarData: PaginatedData<CicloEscolar> | null = null;
  showCreateDocenteDialog: boolean = false;
  menuItems: MenuItem[] = [];

  @ViewChild('dt') dt!: Table;
  private filterSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.academicoService.CicloEscolarListApi().subscribe({
      next: (response) => {
        this.cicloEscolarData = response;
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

  onDetail(id: string): void {
    this.router.navigate([id, 'detail'], {
      relativeTo: this.route,
    });
  }

  updateMenuItems(ciclo_escolar: any): void {
    this.menuItems = [
      {
        label: 'General',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate([`${ciclo_escolar.id}/general`], {
            relativeTo: this.route,
          });
        },
      },
      {
        separator: true,
      },
    ];
  }

  onTableEvent(event?: TableLazyLoadEvent) {
    const globalFilter = Array.isArray(event?.filters?.['global'])
      ? event?.filters?.['global'][0]?.value || ''
      : event?.filters?.['global']?.value || '';

    const filters = {
      global_filter: globalFilter || '',
      ...event?.filters,
    } as CicloEscolarListFilterRequest;
    const orderBy = Array.isArray(event?.sortField)
      ? event?.sortField[0] || ''
      : event?.sortField || '';

    const order = event?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = event?.first || 0;
    const limit = event?.rows || 10;

    this.academicoService
      .CicloEscolarListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.cicloEscolarData = response;
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
