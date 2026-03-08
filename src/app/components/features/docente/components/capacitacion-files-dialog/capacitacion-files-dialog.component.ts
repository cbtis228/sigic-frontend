import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PermissionsService } from '../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileCardComponent } from '../../../../shared/file-card/file-card.component';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileCapacitacion } from '../../../../../interfaces/docente.interface';


@Component({
  selector: 'app-capacitacion-files-dialog',
  imports: [
    CommonModule,
    ButtonModule,
    FileCardComponent,
    Dialog,
    ConfirmDialogModule,
  ],
  templateUrl: './capacitacion-files-dialog.component.html',
  styleUrl: './capacitacion-files-dialog.component.scss',
})
export class CapacitacionFilesDialogComponent {
  constructor(
    private confirmationService: ConfirmationService
  ) {}
  @Input() visible = false;
  @Input() showDelete: boolean | null = false;
  @Input() showDownload: boolean | null = false;
  @Input() showUpload: boolean | null = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() filesCapacitacion: FileCapacitacion[] = [];
  @Output()
  onClickDelete: EventEmitter<FileCapacitacion> = new EventEmitter();
  @Output()
  onClickDownload: EventEmitter<FileCapacitacion> = new EventEmitter();
  @Output() uploadFile = new EventEmitter<File>();


  visibleRegistrarHorasDialog = false;
  visibleUploadFileDialog = false;
  selectedFile: File | null = null;

  confirmDelete(file: FileCapacitacion): void {
    this.confirmationService.confirm({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar el archivo "${file.original_name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.onClickDelete.emit(file);
      },
    });
  }

  onShowUploadFileDialog() {
    this.visibleUploadFileDialog = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  onCancelUpload() {
    this.selectedFile = null;
    this.visibleUploadFileDialog = false;
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.uploadFile.emit(this.selectedFile);

    this.selectedFile = null;
    this.visibleUploadFileDialog = false;
  }
}
