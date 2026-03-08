import { Component, OnInit } from '@angular/core';
import {
  Docente,
  FileDocente,
} from '../../../../../../../interfaces/docente.interface';
import { ActivatedRoute } from '@angular/router';
import { DocenteService } from '../../../../../../../services/docente.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../services/error.service';
import { CommonModule } from '@angular/common';
import { FileCardComponent } from '../../../../../../shared/file-card/file-card.component';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { ButtonIcon, ButtonModule } from 'primeng/button';
import { DocenteFileUploadDialogComponent } from '../../../../components/docente-file-upload-dialog/docente-file-upload-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-documentacion',
  imports: [
    CommonModule,
    FileCardComponent,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardWithTitleComponent,
    ConfirmDialogModule,
    DocenteFileUploadDialogComponent,
  ],
  templateUrl: './documentacion.component.html',
  styleUrl: './documentacion.component.scss',
})
export class DocumentacionComponent implements OnInit {
  id_docente: Docente['id_docente'] | null = null;

  files: FileDocente[] = [];
  showUploadDialog = false;

  globalFilter = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private errorService: ErrorService,
    private docenteService: DocenteService,
    private confirmationService: ConfirmationService,
    public permissionService: PermissionsService,
  ) {}

  private applyGlobalFilter(files: FileDocente[]): FileDocente[] {
    if (!this.globalFilter.trim()) return files;

    const text = this.globalFilter.toLowerCase();
    return files.filter((f) => f.original_name.toLowerCase().includes(text));
  }

  ngOnInit(): void {
    this.id_docente = Number(this.route.parent?.snapshot.paramMap.get('id'));

    if (!this.id_docente) return;
    this.loadExpedienteDocente();
  }

  loadExpedienteDocente() {
    this.docenteService.FilesDocenteDetailApi(this.id_docente!).subscribe({
      next: (response) => {
        this.files = response;
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

  get evidencias(): FileDocente[] {
    return this.applyGlobalFilter(this.files.filter((f) => f.tipo === 1));
  }

  get expediente(): FileDocente[] {
    return this.applyGlobalFilter(this.files.filter((f) => f.tipo === 2));
  }

  get otros(): FileDocente[] {
    return this.applyGlobalFilter(this.files.filter((f) => f.tipo === 3));
  }

  downloadFile(file: FileDocente) {
    this.docenteService
      .FilesDocenteDownloadApi(this.id_docente!, file.id)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.original_name;
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  deleteFile(id_file_servicio: FileDocente['id']) {
    this.docenteService
      .FilesDocenteDeleteApi(this.id_docente!, id_file_servicio)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Archivo eliminado exitosamente',
          });
          this.loadExpedienteDocente();
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

  showConfirmDelete(file: FileDocente): void {
    this.confirmationService.confirm({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar el archivo "${file.original_name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.deleteFile(file.id);
      },
    });
  }

  onUploadFile(file: File, tipo: 1 | 2 | 3) {
    this.docenteService
      .FilesDocenteUploadApi(this.id_docente!, tipo, file)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Evidencia subida exitosamente',
          });
          this.loadExpedienteDocente();
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
