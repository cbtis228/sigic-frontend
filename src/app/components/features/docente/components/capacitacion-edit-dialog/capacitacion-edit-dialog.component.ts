import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TIPO_CAPACITACION,
  ESTATUS_CAPACITACION,
} from '../../../../../global.constants';
import {
  DocenteCapacitacion,
  DocenteCapacitacionUpdate,
} from '../../../../../interfaces/docente.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-capacitacion-edit-dialog',
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
  templateUrl: './capacitacion-edit-dialog.component.html',
  styleUrl: './capacitacion-edit-dialog.component.scss',
})
export class CapacitacionEditDialogComponent {
  tiposCapacitacion = TIPO_CAPACITACION;
  estadosCapacitacion = ESTATUS_CAPACITACION;

  @Input() visible: boolean = false;
  @Input() capacitacion: DocenteCapacitacion | null = null;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onCapacitacionChange: EventEmitter<DocenteCapacitacionUpdate> =
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
    if ((this.visible && this, this.capacitacion)) {
      this.capacitacionForm.reset();
      const [yearI, monthI, dayI] = this.capacitacion.fecha_inicio
        .split('-')
        .map(Number);
      const fechaInicio = new Date(yearI, monthI - 1, dayI);
      const [yearF, monthF, dayF] = this.capacitacion.fecha_fin
        .split('-')
        .map(Number);
      const fechaFin = new Date(yearF, monthF - 1, dayF);
      this.capacitacionForm.patchValue({
        ...this.capacitacion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
    }
  }

  onSubmit() {
    const formValue = this.capacitacionForm.value;
    const fechaInicio = formValue.fecha_inicio.toISOString().split('T')[0];
    const fechaFin = formValue.fecha_fin.toISOString().split('T')[0];
    const objCapacitacionUpdate = {
      ...formValue,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    } as DocenteCapacitacionUpdate;
    this.onCapacitacionChange.emit(objCapacitacionUpdate);
  }
}
