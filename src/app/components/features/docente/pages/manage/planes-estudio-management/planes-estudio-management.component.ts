import { Component, ViewChild } from '@angular/core';
import { AcademicoService } from '../../../../../../services/academico.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaginatedData } from '../../../../../../interfaces/paginated-data.interface';
import { MenuItem } from 'primeng/api';
import {
  PlanEstudio,
  PlanEstudioListFilterRequest,
} from '../../../../../../interfaces/academico.interface';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { debounceTime, Subject } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { defaultEstatusValuePipe } from '../../../../../../pipes/default-estatus-value.pipe';
import { OverlayModule } from 'primeng/overlay';
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-planes-estudio-management',
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
  templateUrl: './planes-estudio-management.component.html',
  styleUrl: './planes-estudio-management.component.scss',
})
export class PlanesEstudioManagementComponent {
  constructor(
    private academicoService: AcademicoService,
    private router: Router,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService
  ) {}

  planEstudioData: PaginatedData<PlanEstudio> | null = null;
  menuItems: MenuItem[] = [];

  @ViewChild('dt') dt!: Table;
  private filterSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.academicoService.PlanEstudioListApi().subscribe({
      next: (response) => {
        this.planEstudioData = response;
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

  updateMenuItems(planEstudio: any): void {
    this.menuItems = [
      {
        label: 'General',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate([`${planEstudio.id}/general`], {
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
    } as PlanEstudioListFilterRequest;
    const orderBy = Array.isArray(event?.sortField)
      ? event?.sortField[0] || ''
      : event?.sortField || '';

    const order = event?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = event?.first || 0;
    const limit = event?.rows || 10;

    this.academicoService
      .PlanEstudioListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.planEstudioData = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
