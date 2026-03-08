import { Component } from '@angular/core';
import { DocenteService } from '../../../../../../../services/docente.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import {
  Capacitacion,
  Docente,
  FileCapacitacion,
} from '../../../../../../../interfaces/docente.interface';
import { ErrorService } from '../../../../../../../services/error.service';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ESTATUS_CAPACITACION } from '../../../../../../../global.constants';
import { CapacitacionFilesDialogComponent } from '../../../../components/capacitacion-files-dialog/capacitacion-files-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-capacitaciones',
  imports: [
    ButtonModule,
    InputTextModule,
    SelectModule,
    TableModule,
    CommonModule,
    FormsModule,
    MenuModule,
    CapacitacionFilesDialogComponent,
  ],
  templateUrl: './capacitaciones.component.html',
  styleUrl: './capacitaciones.component.scss',
})
export class CapacitacionesComponent {
  id_docente: Docente['id_docente'] | null = null;
  menuItems: MenuItem[] = [];
  selectedCapacitacion: Capacitacion | null = null;
  selectedCapacitacionFiles: FileCapacitacion[] = [];
  selectedEstatus: null | number = null

  visibleCapacitacionEvidenciaDialog = false;
  capacitacionesData: Capacitacion[] = [];
  estatusCapacitacion = ESTATUS_CAPACITACION;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private errorService: ErrorService,
    public permissionService: PermissionsService,
  ) {}

  ngOnInit(): void {
    this.id_docente = Number(this.route.parent?.snapshot.paramMap.get('id'));

    this.loadCapacitaciones();
  }

  updateMenuItems(capacitacion: Capacitacion) {
    const items = [];
    items.push({
      label: 'Evidencias',
      icon: 'pi pi-file',
      command: () => {
        this.selectedCapacitacion =capacitacion
        this.loadFilesFromSelectedCapacitacion();
        this.visibleCapacitacionEvidenciaDialog = true;
      },
    });

    this.menuItems = items;
  }

  loadCapacitaciones() {
    if (!this.id_docente) {
      console.error('Docente no valido o no especificado');
      return;
    }
    this.docenteService.CapacitacionGetApi(this.id_docente).subscribe({
      next: (response) => {
        this.capacitacionesData = response;
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail,
        });
      },
    });
  }

  loadFilesFromSelectedCapacitacion() {
    if (!this.selectedCapacitacion || !this.id_docente) {
      console.error('No hay una capacitacion seleccionada o un docente valido');
      return;
    }
    this.docenteService
      .FilesCapacitacionDetailApi(
        this.id_docente,
        this.selectedCapacitacion.id,
      )
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
    if (!this.selectedCapacitacion || !this.id_docente) {
      console.error(
        'No hay una capacitacion seleccionada o un docente valido seleccionado',
      );
      return;
    }
    this.docenteService
      .FilesCapacitacionDownloadApi(
        this.id_docente,
        this.selectedCapacitacion.id,
        file.id,
      )
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.original_name;
        a.click();
        URL.revokeObjectURL(url);
      });
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
}
