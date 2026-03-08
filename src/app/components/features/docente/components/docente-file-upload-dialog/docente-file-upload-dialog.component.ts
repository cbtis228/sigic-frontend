import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TIPO_FILE_DOCENTE } from '../../../../../global.constants';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileDocente } from '../../../../../interfaces/docente.interface';

@Component({
  selector: 'app-docente-file-upload-dialog',
  imports: [
    CommonModule,
    DialogModule,
    SelectModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './docente-file-upload-dialog.component.html',
  styleUrl: './docente-file-upload-dialog.component.scss',
})
export class DocenteFileUploadDialogComponent {
  selectedFile: File | null = null;
  tipoFileDocente = TIPO_FILE_DOCENTE;
  selectedTipo: 1 | 2 | 3 = 3;
  @Output() uploadFile = new EventEmitter<{file: File, tipo:FileDocente['tipo']}>();
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

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
    this.visible = false;
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.uploadFile.emit({file: this.selectedFile, tipo:this.selectedTipo});

    this.selectedFile = null;
    this.visible = false;
  }
}
