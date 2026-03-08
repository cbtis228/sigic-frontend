import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import {
  Alumno,
  AlumnoUpdate,
} from '../../../../../interfaces/alumno.interface';
import { ESTADOS_ALUMNO } from '../../../../../global.constants';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'app-alumno-edit-general-card',
  imports: [
    CommonModule,
    CardWithTitleComponent,
    InputTextModule,
    ReactiveFormsModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './alumno-edit-general-card.component.html',
  styleUrl: './alumno-edit-general-card.component.scss',
})
export class AlumnoEditGeneralCardComponent implements OnChanges{
  @Input() alumno!: Alumno;
  @Input() showStatus: boolean = false;
  @Input() showSkeletons: boolean  = true;
  @Output() updatedAlumno: EventEmitter<AlumnoUpdate> =
    new EventEmitter<AlumnoUpdate>();
  alumnoForm: FormGroup;
  estadosAlumno = ESTADOS_ALUMNO
  firstRequestCompleted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.alumnoForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      paterno: ['', Validators.required],
      materno: ['', Validators.required],
      telefono: [''],
      domicilio: [''],
      discapacidades: [''],
      enfermedades: [''],
      estatus: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alumno'] && this.alumno) {
      this.alumnoForm.patchValue(this.alumno);
    }
  }

  onSubmit(): void {
    const updatedAlumno = this.alumnoForm.getRawValue() as AlumnoUpdate;
    this.updatedAlumno.emit(updatedAlumno);
  }
}
