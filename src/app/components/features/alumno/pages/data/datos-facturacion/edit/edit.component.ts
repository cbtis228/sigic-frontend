import { Component } from '@angular/core';
import {
  DatosFacturacion,
  DatosFacturacionUpdate,
} from '../../../../../../../interfaces/alumno.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { AlumnosService } from '../../../../../../../services/alumnos.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { EditDatosFacturacionComponent } from '../../../../components/edit-datos-facturacion-card/edit-datos-facturacion-card.component';
import { ErrorService } from '../../../../../../../services/error.service';

@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    EditDatosFacturacionComponent,
    ButtonModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  datosFacturacion!: DatosFacturacion;

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private erroService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.alumnoService.DatosFacturacionSelfDetailApi().subscribe({
      next: (response) => {
        this.datosFacturacion = response;
      },
      error: (error) => {
        const detail = this.erroService.formatError(error);
        this.messageService.add({ detail, severity: 'error' });
      },
    });
  }

  onSubmit(updatedDatosFacturacion: DatosFacturacionUpdate): void {
    this.alumnoService
      .DatosFacturacionSelfUpdateApi(updatedDatosFacturacion)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Datos actualizados con exito',
          });
        },
      });
  }
}
