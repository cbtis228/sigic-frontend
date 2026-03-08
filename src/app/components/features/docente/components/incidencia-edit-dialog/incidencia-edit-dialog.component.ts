import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import {
  Incidencia,
  IncidenciaUpdate,
} from '../../../../../interfaces/academico.interface';
import { InscripcionAutocompleteComponent } from '../inscripcion-autocomplete/inscripcion-autocomplete.component';
import {
    ESTADOS_GENERALES,
  GRAVEDAD_INCIDENCIA,
  TIPO_INCIDENCIA,
} from '../../../../../global.constants';

@Component({
  selector: 'app-incidencia-edit-dialog',
  imports: [
    CommonModule,
    DialogModule,
    DatePicker,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    InscripcionAutocompleteComponent,
  ],
  templateUrl: './incidencia-edit-dialog.component.html',
  styleUrl: './incidencia-edit-dialog.component.scss',
})
export class IncidenciaEditDialogComponent implements OnChanges {
  tiposIncidencia = TIPO_INCIDENCIA;
  nivelesGravedad = GRAVEDAD_INCIDENCIA;
  estatuses = ESTADOS_GENERALES;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() incidencia: Incidencia | null = null;
  @Output() onIncidenciaUpdate = new EventEmitter<IncidenciaUpdate>();

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
      estatus: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incidencia'] && this.incidencia) {
      this.incidenciaForm.patchValue({
        inscripcion: this.incidencia.inscripcion,
        tipo: this.incidencia.tipo,
        fecha: new Date(this.incidencia.fecha),
        descripcion: this.incidencia.descripcion,
        gravedad: this.incidencia.gravedad,
        medidas_tomadas: this.incidencia.medidas_tomadas,
        seguimiento: this.incidencia.seguimiento,
        estatus: this.incidencia.estatus,
      });
    }
  }

  onSubmit() {
    if (this.incidenciaForm.invalid) return;

    const formValue = this.incidenciaForm.value;
    const objIncidenciaUpdate: IncidenciaUpdate = {
      ...formValue,
      inscripcion:
        formValue.inscripcion?.id ?? this.incidencia?.inscripcion?.id,
      fecha: formValue.fecha?.toISOString().split('T')[0],
    };
    this.onIncidenciaUpdate.emit(objIncidenciaUpdate);
  }
}
