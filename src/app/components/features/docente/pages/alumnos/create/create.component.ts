// create.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardWithTitleComponent } from '../../../../../shared/card-with-title/card-with-title.component';
import { DatePickerModule } from 'primeng/datepicker';
import { ErrorService } from '../../../../../../services/error.service';
import { AlumnoCreate } from '../../../../../../interfaces/alumno.interface';
import { emailFormatValidator } from '../../../../../../validators/email-format';

@Component({
  selector: 'app-create-alumno',
  imports: [
    CommonModule,
    DatePickerModule,
    ReactiveFormsModule,
    CardWithTitleComponent,
    RouterModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      paterno: ['', Validators.required],
      materno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email, emailFormatValidator()]],
      telefono: [''],
      domicilio: [''],
      discapacidades: [''],
      enfermedades: [''],
      fecha_ingreso: [new Date(), Validators.required],
    });
  }

  onAlumnoSave(): void {
    if (this.form.invalid) return;
    const alumno = {
      ...this.form.value,
      fecha_ingreso: this.form.value.fecha_ingreso.toISOString().split('T')[0],
    } as AlumnoCreate;
    this.alumnoService.AlumnoCreateApi(alumno).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Alumno creado exitosamente',
          severity: 'success',
        });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (error) => {
        const detail = this.errorService.formatError(error)
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }
}
