import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { Alumno } from '../../../../../interfaces/alumno.interface';

@Component({
  selector: 'app-create-alumno-dialog',
  imports: [
    DialogModule,
    CalendarModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './alumno-create-dialog.component.html',
  styleUrl: './alumno-create-dialog.component.scss',
})
export class AlumnoCreateDialogComponent {
  visible = false;
  form: FormGroup;

  @Output() save = new EventEmitter<Alumno>();
  @Input() showDialog: boolean = false;
  @Output() showDialogChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      horas: [0, Validators.required],
      fecha_registro: [new Date(), Validators.required],
    });
  }

  close() {
    this.showDialogChange.emit(false);
  }

  onSave() {
    const rawValue = this.form.value;
    if (rawValue.fecha_ingreso) {
      rawValue.fecha_ingreso = new Date(rawValue.fecha_ingreso)
        .toISOString()
        .split('T')[0]; // yyyy-mm-dd
    }
    this.save.emit(rawValue);
    this.close();
  }
}
