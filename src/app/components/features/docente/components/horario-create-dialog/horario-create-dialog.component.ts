import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  Grupo,
  HorarioCreate,
} from '../../../../../interfaces/academico.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { AsignacionDocenteAutocompleteComponent } from '../asignacion-docente-autocomplete/asignacion-docente-autocomplete.component';
import { SalonAutocompleteComponent } from '../salon-autocomplete/salon-autocomplete.component';


@Component({
  selector: 'app-horario-create-dialog',
  imports: [
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    AsignacionDocenteAutocompleteComponent,
    SalonAutocompleteComponent
  ],
  templateUrl: './horario-create-dialog.component.html',
  styleUrl: './horario-create-dialog.component.scss',
})
export class HorarioCreateDialogComponent {
  @Input() visible: boolean = false;
  @Input() grupo: Grupo | null = null;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onHorarioCreate: EventEmitter<HorarioCreate> = new EventEmitter();
  horarioForm: FormGroup;

  diasSemana = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
  ];
  constructor(private fb: FormBuilder) {
    this.horarioForm = this.fb.group({
      asignacion_docente: [null, Validators.required],
      dia_semana: [[], [ Validators.required, Validators.minLength(1)]],
      hora_inicio: [new Date(), Validators.required],
      hora_fin: [new Date(), Validators.required],
      salon: [null, Validators.required],
    });
  }

  formatHour(date: Date): string {
    return (
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0') +
      ':' +
      '00'
    );
  }

  onSubmit() {
    const objForm = this.horarioForm.getRawValue();
    const objHorario = {
      salon: objForm.salon.id,
      grupo: this.grupo?.id,
      asignacion_docente: objForm.asignacion_docente.id,
      hora_inicio: this.formatHour(objForm.hora_inicio),
      hora_fin: this.formatHour(objForm.hora_fin),
      dia_semana: objForm.dia_semana
    };
    this.onHorarioCreate.emit(objHorario);
  }
}
