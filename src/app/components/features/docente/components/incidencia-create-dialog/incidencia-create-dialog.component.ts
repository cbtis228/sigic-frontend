import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IncidenciaCreate } from '../../../../../interfaces/academico.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import {
  GRAVEDAD_INCIDENCIA,
  TIPO_INCIDENCIA,
} from '../../../../../global.constants';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InscripcionAutocompleteComponent } from '../inscripcion-autocomplete/inscripcion-autocomplete.component';

@Component({
  selector: 'app-incidencia-create-dialog',
  imports: [
    InscripcionAutocompleteComponent,
    DialogModule,
    DatePicker,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './incidencia-create-dialog.component.html',
  styleUrl: './incidencia-create-dialog.component.scss',
})
export class IncidenciaCreateDialogComponent implements OnChanges {
  tiposIncidencia = TIPO_INCIDENCIA;
  nivelesGravedad = GRAVEDAD_INCIDENCIA;

  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onIncidenciaCreate: EventEmitter<IncidenciaCreate> =
    new EventEmitter();
  incidenciaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.incidenciaForm = this.fb.group({
      inscripcion: [null, Validators.required],
      tipo: [null, Validators.required],
      fecha: [null, Validators.required],
      descripcion: [null, Validators.required],
      gravedad: [null, Validators.required],
      medidas_tomadas: [''],
      seguimiento: [''],
    });
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.incidenciaForm.reset();
    }
  }

  onSubmit() {
    const formValue = this.incidenciaForm.value;
    const objIncidenciaCreate = {
      ...formValue,
      medidas_tomadas: formValue.medidas_tomadas || '',
      seguimiento: formValue.seguimiento || '',
      inscripcion: formValue.inscripcion.id,
      fecha: formValue.fecha.toISOString().split('T')[0],
    };
    this.onIncidenciaCreate.emit(objIncidenciaCreate);
  }
}
