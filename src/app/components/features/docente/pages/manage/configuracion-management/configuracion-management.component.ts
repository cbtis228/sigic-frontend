import { Component, OnInit } from '@angular/core';
import { Configuracion } from '../../../../../../interfaces/core.interface';
import { CoreService } from '../../../../../../services/core.service';
import { ErrorService } from '../../../../../../services/error.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-configuracion-management',
  templateUrl: './configuracion-management.component.html',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
  ],
  styleUrl: './configuracion-management.component.scss',
})
export class ConfiguracionManagementComponent implements OnInit {
  configuracion: Configuracion | null = null;
  configuracionBackup: Configuracion | null = null;

  isEditing = false;
  isSaving = false;

  generoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
  ];

  constructor(
    private coreService: CoreService,
    private errorService: ErrorService,
    public permissionsService: PermissionsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadConfiguracion();
  }

  loadConfiguracion(): void {
    this.coreService.ConfiguracionDetailApi().subscribe({
      next: (response) => {
        this.configuracion = response;
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          severity: 'error',
          detail,
        });
      },
    });
  }

  onEdit(): void {
    if (!this.configuracion) return;

    this.configuracionBackup = JSON.parse(JSON.stringify(this.configuracion));

    this.isEditing = true;
  }

  onCancel(): void {
    if (this.configuracionBackup) {
      this.configuracion = JSON.parse(JSON.stringify(this.configuracionBackup));
    }

    this.isEditing = false;
    this.configuracionBackup = null;
  }

  isFormValid(): boolean {
    if (!this.configuracion) return false;

    const requiredFields = [
      this.configuracion.nombre_institucion,
      this.configuracion.clave_centro,
      this.configuracion.organismo,
      this.configuracion.subsecretaria,
      this.configuracion.direccion,
      this.configuracion.colonia,
      this.configuracion.codigo_postal,
      this.configuracion.ciudad,
      this.configuracion.estado,
      this.configuracion.telefono,
      this.configuracion.correo_institucional,
      this.configuracion.nombre_director,
      this.configuracion.genero_director,
    ];

    return requiredFields.every((field) => field?.trim());
  }

  onSave(): void {
    if (!this.configuracion || this.isSaving) return;

    this.isSaving = true;

    this.coreService.ConfiguracionUpdateApi(this.configuracion).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.configuracionBackup = null;

        this.messageService.add({
          severity: 'success',
          detail: 'Configuración actualizada correctamente',
        });
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          severity: 'error',
          detail,
        });
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }
}
