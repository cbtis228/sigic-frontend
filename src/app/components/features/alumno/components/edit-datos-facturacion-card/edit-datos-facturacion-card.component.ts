import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { DatosFacturacion, DatosFacturacionUpdate } from '../../../../../interfaces/alumno.interface';

@Component({
  selector: 'app-edit-datos-facturacion-alumno-card',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardWithTitleComponent,
    InputTextModule,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './edit-datos-facturacion-card.component.html',
  styleUrl: './edit-datos-facturacion-card.component.scss'
})
export class EditDatosFacturacionComponent implements OnChanges {
  @Input() datosFacturacion!: DatosFacturacion;
  @Input() showSkeletons: boolean  = true;
  @Output() updatedDatosFacturacion: EventEmitter<DatosFacturacionUpdate> =
    new EventEmitter<DatosFacturacionUpdate>();
  facturacionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.facturacionForm = this.formBuilder.group({
      rfc: [''],
      razon_social: [''],
      codigo_postal: [''],
      regimen_fiscal: [''],
      uso_factura: [''],
      domicilio_fiscal: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosFacturacion'] && this.datosFacturacion) {
      this.facturacionForm.patchValue(this.datosFacturacion);
    }
  }

  onSubmit(): void {
    const updatedDatosFacturacion = this.facturacionForm.getRawValue() as DatosFacturacionUpdate
    this.updatedDatosFacturacion.emit(updatedDatosFacturacion);
  }
}
