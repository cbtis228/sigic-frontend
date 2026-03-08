import { Component, OnInit } from '@angular/core';
import {
  DocenteCapacitacion,
  DocenteCapacitacionCreate,
  DocenteCapacitacionUpdate,
  FileCapacitacion,
} from '../../../../../interfaces/docente.interface';
import { DocenteService } from '../../../../../services/docente.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableFilterEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
  ConfirmationService,
  FilterMetadata,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { CapacitacionCreateDialogComponent } from '../../components/capacitacion-create-dialog/capacitacion-create-dialog.component';
import { ErrorService } from '../../../../../services/error.service';
import { CapacitacionEditDialogComponent } from '../../components/capacitacion-edit-dialog/capacitacion-edit-dialog.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CapacitacionFilesDialogComponent } from '../../components/capacitacion-files-dialog/capacitacion-files-dialog.component';
import { FormsModule } from '@angular/forms';
import { ESTATUS_CAPACITACION } from '../../../../../global.constants';

@Component({
  selector: 'app-capacitaciones',
  imports: [
    ButtonModule,
    InputTextModule,
    SelectModule,
    TableModule,
    CommonModule,
    CapacitacionCreateDialogComponent,
    MenuModule,
    CapacitacionEditDialogComponent,
    ConfirmDialog,
    FormsModule,
    CapacitacionFilesDialogComponent,
  ],
  templateUrl: './capacitaciones.component.html',
  styleUrl: './capacitaciones.component.scss',
})
export class CapacitacionesComponent implements OnInit {
  capacitacionesData: DocenteCapacitacion[] = [];
  menuItems: MenuItem[] = [];

  estatusCapacitacion = ESTATUS_CAPACITACION

  selectedEstatus: null | number = null

  visibleCapacitacionEvidenciaDialog = false;
  visibleCapacitacionCreateDialog = false;
  visibleCapacitacionEditDialog = false;

  selectedCapacitacion: DocenteCapacitacion | null = null;
  selectedCapacitacionFiles: FileCapacitacion[] = [];

  constructor(
    private docenteService: DocenteService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.docenteService.CapacitacionSelfGetApi().subscribe({
      next: (response) => {
        this.capacitacionesData = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadFilesFromSelectedCapacitacion() {
    if (!this.selectedCapacitacion) {
      console.error('No hay una capacitacion seleccionada');
      return;
    }
    this.docenteService
      .FilesCapacitacionSelfDetailApi(this.selectedCapacitacion.id)
      .subscribe({
        next: (response) => {
          this.selectedCapacitacionFiles = response;
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
  downloadFile(file: FileCapacitacion) {
    if (!this.selectedCapacitacion) {
      console.error('No hay una capacitacion seleccionada');
      return;
    }
    this.docenteService
      .FilesCapacitacionSelfDownloadApi(this.selectedCapacitacion.id, file.id)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.original_name;
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  onDeleteFile(id_file_capacitacion: FileCapacitacion['id']) {
    if (!this.selectedCapacitacion) {
      console.error('No hay una capacitacion seleccionada');
      return;
    }
    this.docenteService
      .FilesCapacitacionSelfSoftDeleteApi(
        this.selectedCapacitacion.id,
        id_file_capacitacion,
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Archivo eliminado exitosamente',
          });
          this.loadFilesFromSelectedCapacitacion();
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

  onUploadFile(event: File) {
    this.docenteService
      .FilesCapacitacionUploadApi(this.selectedCapacitacion!.id, event)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Evidencia subida exitosamente',
          });
          this.loadFilesFromSelectedCapacitacion();
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

  updateMenuItems(capacitacion: DocenteCapacitacion) {
    const items = [];
    items.push({
      label: 'Evidencias',
      icon: 'pi pi-file',
      command: () => {
        this.visibleCapacitacionEvidenciaDialog = true;
        this.selectedCapacitacion = capacitacion;
        this.loadFilesFromSelectedCapacitacion();
      },
    });

    items.push({
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => {
        this.visibleCapacitacionEditDialog = true;
        this.selectedCapacitacion = capacitacion;
      },
    });

    items.push({ separator: true });

    items.push({
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        this.onDeleteCapacitacion(capacitacion);
      },
    });

    this.menuItems = items;
  }

  get totalCapacitaciones() {
    return this.capacitacionesData.length;
  }

  get totalCurrentMonthCapacitaciones() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.capacitacionesData.filter((c) => {
      const [year, month, day] = c.fecha_inicio.split('-').map(Number);

      const fechaInicio = new Date(year, month - 1, day);

      return (
        fechaInicio.getMonth() === currentMonth &&
        fechaInicio.getFullYear() === currentYear
      );
    }).length;
  }

  get totalCertificatedHours() {
    const total = this.capacitacionesData.reduce((acc, c) => {
      if (c.estatus_capacitacion == 3) {
        return acc + c.duracion;
      }
      return acc;
    }, 0);
    return Math.round(total);
  }

  get avarageCertificatedHours() {
    const totalHours = this.capacitacionesData.reduce(
      (acc, c) => acc + c.duracion,
      0,
    );
    const totalCertificatedHours = this.capacitacionesData.reduce((acc, c) => {
      if (c.estatus_capacitacion == 3) {
        return acc + c.duracion;
      }
      return acc;
    }, 0);
    if (totalCertificatedHours == 0 && totalHours == 0) return 0;
    return Math.round((totalCertificatedHours / totalHours) * 100);
  }

  get totalPendingCertificatedCapacitaciones() {
    return this.capacitacionesData.filter((c) => c.estatus_capacitacion != 3)
      .length;
  }

  get totalCompletedCapacitaciones() {
    return this.capacitacionesData.filter((c) => c.estatus_capacitacion === 2)
      .length;
  }

  get percentajeOfCompletedCapacitaciones() {
    const percentaje =
      (this.capacitacionesData.filter((c) => c.estatus_capacitacion === 2)
        .length /
        this.totalCapacitaciones) *
      100;

    return Math.round(percentaje) || 0;
  }

  getTipoCapacitacionBadgeClass(tipo: number): string {
    const classes: Record<number, string> = {
      1: 'bg-indigo-100 text-indigo-800',
      2: 'bg-cyan-100 text-cyan-800',
      3: 'bg-violet-100 text-violet-800',
    };

    return classes[tipo] || 'bg-slate-100 text-slate-800';
  }

  getEstadoCapacitacionIcon(estado: number): string {
    const icons: Record<number, string> = {
      1: 'pi pi-hourglass',
      2: 'pi pi-check-circle',
      3: 'pi pi-verified',
    };

    return icons[estado] || 'pi pi-info-circle';
  }

  getEstadoCapacitacionBadgeClass(estado: number): string {
    const classes: Record<number, string> = {
      1: 'bg-amber-100 text-amber-800 outline-amber-900',
      2: 'bg-cyan-100 text-cyan-800',
      3: 'bg-green-200 text-green-900',
    };

    return classes[estado] || 'bg-slate-100 text-slate-800';
  }

  createCapacitacion(capacitacion: DocenteCapacitacionCreate) {
    this.docenteService.CapacitacionSelfCreateApi(capacitacion).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Capacitacion registrada exitosamente',
          severity: 'success',
        });
        this.visibleCapacitacionCreateDialog = false;
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

  updateCapacitacion(capacitacion: DocenteCapacitacionUpdate) {
    this.docenteService
      .CapacitacionSelfUpdateApi(this.selectedCapacitacion!.id, capacitacion)
      .subscribe({
        next: () => {
          this.messageService.add({
            detail: 'Capacitacion actualizada exitosamente',
            severity: 'success',
          });
          this.selectedCapacitacion = null;
          this.ngOnInit();
          this.visibleCapacitacionEditDialog = false;
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

  softDeleteCapacitacion(id_capacitacion: DocenteCapacitacion['id']) {
    this.docenteService
      .CapacitacionSelfSoftDeleteApi(id_capacitacion)
      .subscribe({
        next: () => {
          this.messageService.add({
            detail: 'Capacitacion eliminada exitosamente',
            severity: 'success',
          });
          this.selectedCapacitacion = null;
          this.ngOnInit();
          this.visibleCapacitacionEditDialog = false;
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

  onDeleteCapacitacion(event: DocenteCapacitacion): void {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar este registro de capacitacion? Esta acción es irreversible.',
      header: 'Confirmar eliminación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.softDeleteCapacitacion(event.id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Accion cancelada',
          life: 3000,
        });
      },
    });
  }
}
