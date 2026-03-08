import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import {
  Grupo,
  HorarioUpdate,
} from '../../../../../interfaces/academico.interface';
import { AsignacionDocenteAutocompleteComponent } from '../asignacion-docente-autocomplete/asignacion-docente-autocomplete.component';
import { SalonAutocompleteComponent } from '../salon-autocomplete/salon-autocomplete.component';

@Component({
  selector: 'app-horario-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    DatePickerModule,
    SalonAutocompleteComponent,
    AsignacionDocenteAutocompleteComponent
  ],
  templateUrl: './horario-edit-dialog.component.html',
  styleUrl: './horario-edit-dialog.component.scss',
})
export class HorarioEditDialogComponent {
  @Input() visible: boolean = false;
  @Input() grupo: Grupo | null = null;
  @Input() horario: any | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHorarioUpdate = new EventEmitter<HorarioUpdate>();

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
      dia_semana: [null, Validators.required],
      hora_inicio: [null, Validators.required],
      hora_fin: [null, Validators.required],
      salon: [''],
    });
  }

  /** Convertir Date a HH:mm:00 */
  private formatHour(date: Date): string {
    return (
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0') +
      ':00'
    );
  }

  /** Cargar datos cuando llega el horario */
  ngOnChanges() {
    if (this.horario) {
      this.horarioForm.patchValue({
        asignacion_docente: this.horario.asignacion_docente,
        dia_semana: this.horario.dia_semana,
        hora_inicio: this.stringToDate(this.horario.hora_inicio),
        hora_fin: this.stringToDate(this.horario.hora_fin),
        salon: this.horario.salon || '',
      });
    }
  }

  private stringToDate(time: string): Date {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  onSubmit() {
    const val = this.horarioForm.getRawValue();
    const updateObj: HorarioUpdate = {
      ...val,
      salon: val.salon?.id,
      asignacion_docente: val.asignacion_docente.id,
      dia_semana: val.dia_semana,
      hora_inicio: this.formatHour(val.hora_inicio),
      hora_fin: this.formatHour(val.hora_fin),
      grupo: this.grupo!.id,
    };
    this.onHorarioUpdate.emit(updateObj);
  }
}

