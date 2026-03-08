import { Component, ViewChild } from '@angular/core';
import {
  Table,
  TableFilterEvent,
  TableLazyLoadEvent,
  TableModule,
} from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayModule } from 'primeng/overlay';
import { PopoverModule } from 'primeng/popover';
import { IconFieldModule } from 'primeng/iconfield';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlumnoEstatusValuePipe } from '../../../../../pipes/alumno-estatus-value.pipe';
import { AlumnosService } from '../../../../../services/alumnos.service';
import {
  Alumno,
  AlumnoListFilterRequest,
} from '../../../../../interfaces/alumno.interface';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { InputTextModule } from 'primeng/inputtext';
import { combineLatest, debounceTime, map, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ESTADOS_ALUMNO } from '../../../../../global.constants';
import { SelectModule } from 'primeng/select';
import { PermissionsService } from '../../../../../services/permissions.service';

@Component({
  selector: 'app-alumnos-management-list',
  imports: [
    TableModule,
    MenuModule,
    IconFieldModule,
    CommonModule,
    AlumnoEstatusValuePipe,
    InputIconModule,
    OverlayModule,
    PopoverModule,
    InputTextModule,
    SelectModule,
    RouterModule,
    SplitButtonModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.scss',
})
export class AlumnosManagementComponent {
  constructor(
    private alumnoService: AlumnosService,
    private router: Router,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService,
  ) {}

  alumnoData: PaginatedData<Alumno> | null = null;
  showCreateAlumnoDialog: boolean = false;
  menuItems: MenuItem[] = [];
  estatuses = ESTADOS_ALUMNO;

  @ViewChild('dt') dt!: Table;
  private filterSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.permissionsService.has$('view_alumno');
    this.alumnoService.AlumnoListApi().subscribe({
      next: (response) => {
        this.alumnoData = response;
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

  onDetail(numero_control: string): void {
    this.router.navigate([numero_control, 'detail'], {
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
    } as AlumnoListFilterRequest;
    const orderBy = Array.isArray(event?.sortField)
      ? event?.sortField[0] || ''
      : event?.sortField || '';

    const order = event?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = event?.first || 0;
    const limit = event?.rows || 10;

    this.alumnoService
      .AlumnoListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.alumnoData = response;
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

  getAlumnosActivosCount(): number {
    return (
      this.alumnoData?.results.filter((a: any) => a.estatus === 1).length || 0
    );
  }

  getAlumnosInactivosCount(): number {
    return (
      this.alumnoData?.results.filter((a: any) => a.estatus === 0).length || 0
    );
  }

  getPromedioEdad(): string {
    return '22';
  }

  updateMenuItems(alumno: any): void {
    combineLatest([
      this.permissionsService.has$('alumnos.view_alumno'),
      this.permissionsService.has$('alumnos.view_contactosemergencia'),
      this.permissionsService.has$('alumnos.view_datosfacturacion'),
      this.permissionsService.has$('academico.view_historialacademico'),
      this.permissionsService.has$('academico.view_asistencia'),
    ])
      .pipe(
        map(
          ([
            canViewGeneral,
            canViewContactos,
            canViewFacturacion,
            canViewHistorial,
            canViewAsistencia,
          ]) => {
            const items: any[] = [];

            if (canViewGeneral) {
              items.push({
                label: 'Información General',
                icon: 'pi pi-user',
                command: () =>
                  this.navigateTo(alumno.numero_control, 'general'),
              });
            }

            if (canViewContactos) {
              items.push({
                label: 'Contactos de Emergencia',
                icon: 'pi pi-address-book',
                command: () =>
                  this.navigateTo(
                    alumno.numero_control,
                    'contactos-emergencia',
                  ),
              });
            }

            if (canViewFacturacion) {
              items.push({
                label: 'Datos de Facturación',
                icon: 'pi pi-receipt',
                command: () =>
                  this.navigateTo(alumno.numero_control, 'datos-facturacion'),
              });
            }

            if (canViewHistorial || canViewAsistencia) {
              items.push({ separator: true });
            }

            if (canViewHistorial) {
              items.push({
                label: 'Historial Académico',
                icon: 'pi pi-history',
                command: () =>
                  this.navigateTo(alumno.numero_control, 'historial-academico'),
              });
            }

            // if (canViewAsistencia) {
            //   items.push({
            //     label: 'Asistencia',
            //     icon: 'pi pi-clock',
            //     command: () =>
            //       this.navigateTo(alumno.numero_control, 'asistencia'),
            //   });
            // }

            if (items.length === 0) {
              items.push({ label: 'No cuentas con acciones disponibles' });
            }

            return items;
          },
        ),
      )
      .subscribe((items) => {
        this.menuItems = items;
      });
  }

  private navigateTo(numeroControl: string, section: string): void {
    this.router.navigate([`${numeroControl}/${section}`], {
      relativeTo: this.route,
    });
  }
}
