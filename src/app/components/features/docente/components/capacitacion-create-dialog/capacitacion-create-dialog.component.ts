import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ESTATUS_CAPACITACION,
  TIPO_CAPACITACION,
} from '../../../../../global.constants';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DocenteCapacitacionCreate } from '../../../../../interfaces/docente.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-capacitacion-create-dialog',
  imports: [
    DialogModule,
    DatePicker,
    InputTextModule,
    ReactiveFormsModule,
    InputNumberModule,
    CommonModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './capacitacion-create-dialog.component.html',
  styleUrl: './capacitacion-create-dialog.component.scss',
})
export class CapacitacionCreateDialogComponent {
  tiposCapacitacion = TIPO_CAPACITACION;
  estadosCapacitacion = ESTATUS_CAPACITACION;

  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onCapacitacionCreate: EventEmitter<DocenteCapacitacionCreate> =
    new EventEmitter();
  capacitacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.capacitacionForm = this.fb.group(
      {
        nombre: [null, Validators.required],
        duracion: [1, Validators.required],
        tipo: [1, Validators.required],
        lugar: ['', Validators.required],
        fecha_inicio: [new Date(), Validators.required],
        fecha_fin: [new Date(), Validators.required],
        estatus_capacitacion: [1, Validators.required],
      },
      { validators: this.dateValidator },
    );
  }

  dateValidator(form: AbstractControl): ValidationErrors | null {
    const fechaInicio = form.get('fecha_inicio')?.value;
    const fechaFin = form.get('fecha_fin')?.value;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (inicio > fin) {
        return { fechaInvalida: true };
      }
    }

    return null;
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.capacitacionForm.reset();
    }
  }

  onSubmit() {
    const formValue = this.capacitacionForm.value;
    const fechaInicio = formValue.fecha_inicio.toISOString().split('T')[0];
    const fechaFin = formValue.fecha_fin.toISOString().split('T')[0];
    const objCapacitacionCreate = {
      ...formValue,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    } as DocenteCapacitacionCreate;
    this.onCapacitacionCreate.emit(objCapacitacionCreate);
  }
}
