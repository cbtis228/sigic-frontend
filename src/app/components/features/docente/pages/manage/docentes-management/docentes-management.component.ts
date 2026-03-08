import { Component, ViewChild } from '@angular/core';
import { DocenteService } from '../../../../../../services/docente.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaginatedData } from '../../../../../../interfaces/paginated-data.interface';
import {
  Docente,
  DocenteListFilterRequest,
} from '../../../../../../interfaces/docente.interface';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { combineLatest, debounceTime, map, Subject } from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { OverlayModule } from 'primeng/overlay';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { docenteEstatusValuePipe } from '../../../../../../pipes/docente-estatus-value.pipe';
import { ESTADOS_DOCENTE } from '../../../../../../global.constants';
import { SelectModule } from 'primeng/select';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-docentes-management',
  imports: [
    TableModule,
    MenuModule,
    docenteEstatusValuePipe,
    IconFieldModule,
    CommonModule,
    IconFieldModule,
    OverlayModule,
    PopoverModule,
    InputTextModule,
    InputIconModule,
    RouterModule,
    SelectModule,
    SplitButtonModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './docentes-management.component.html',
  styleUrl: './docentes-management.component.scss',
})
export class DocentesManagementComponent {
  constructor(
    private docenteService: DocenteService,
    private router: Router,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService,
  ) {}

  menuItems: MenuItem[] = [];
  docenteData: PaginatedData<Docente> | null = null;
  showCreateDocenteDialog: boolean = false;
  estatuses = ESTADOS_DOCENTE;

  @ViewChild('dt') dt!: Table;
  private filterSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.docenteService.DocenteListApi().subscribe({
      next: (response) => {
        this.docenteData = response;
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

  updateMenuItems(docente: Docente): void {
    combineLatest([
      this.permissionsService.has$('docentes.view_filedocente'),
      this.permissionsService.has$('docentes.view_capacitacion'),
    ])
      .pipe(
        map(([canViewFilesDocente, canViewCapacitaciones]) => {
          const items: any[] = [];

          items.push({
            label: 'Información General',
            icon: 'pi pi-user',
            command: () => {
              this.router.navigate([`${docente.id_docente}/general`], {
                relativeTo: this.route,
              });
            },
          });

          if (canViewFilesDocente) {
            items.push({
              label: 'Documentacion',
              icon: 'pi pi-briefcase',
              command: () => {
                this.router.navigate([`${docente.id_docente}/documentacion`], {
                  relativeTo: this.route,
                });
              },
            });
          }
          if (canViewCapacitaciones) {
            items.push({
              label: 'Capacitacion',
              icon: 'pi pi-graduation-cap',
              command: () => {
                this.router.navigate([`${docente.id_docente}/capacitaciones`], {
                  relativeTo: this.route,
                });
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
    const globalFilter = Array.isArray(event?.filters?.['global'])
      ? event?.filters?.['global'][0]?.value || ''
      : event?.filters?.['global']?.value || '';

    const filters = {
      global_filter: globalFilter || '',
      ...event?.filters,
    } as DocenteListFilterRequest;
    const orderBy = Array.isArray(event?.sortField)
      ? event?.sortField[0] || ''
      : event?.sortField || '';

    const order = event?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = event?.first || 0;
    const limit = event?.rows || 10;

    this.docenteService
      .DocenteListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.docenteData = response;
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
