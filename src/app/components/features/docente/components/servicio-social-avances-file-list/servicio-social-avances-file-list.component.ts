import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FileServicioSocial,
  RegistroHorasServicioSocial,
} from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { FileCardComponent } from '../../../../shared/file-card/file-card.component';
import { PermissionsService } from '../../../../../services/permissions.service';

@Component({
  selector: 'app-servicio-social-avances-file-list',
  imports: [CommonModule, ButtonModule, FileCardComponent],
  templateUrl: './servicio-social-avances-file-list.component.html',
  styleUrl: './servicio-social-avances-file-list.component.scss',
})
export class ServicioSocialAvancesFileListComponent {
  constructor(
    private confirmationService: ConfirmationService,
    public permissionService: PermissionsService
  ) {}

  @Input() filesServicioSocial: FileServicioSocial[] = [];
  @Output()
  onClickDelete: EventEmitter<FileServicioSocial> = new EventEmitter();
  @Output()
  onClickDownload: EventEmitter<FileServicioSocial> = new EventEmitter();

  confirmDelete(file: FileServicioSocial): void {
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
}
