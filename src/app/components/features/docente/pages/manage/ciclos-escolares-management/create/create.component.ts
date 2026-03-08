import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { CicloEscolar } from '../../../../../../../interfaces/academico.interface';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardWithTitleComponent,
    DatePickerModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private academicoService: AcademicoService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_ciclo: ['', Validators.required],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
    });
  }

  onCicloEscolarSave(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    const fechaInicio = formValue.fecha_inicio.toISOString().split('T')[0]
    const fechaFin = formValue.fecha_fin.toISOString().split('T')[0]
    const cicloEscolar: CicloEscolar = {...formValue, fecha_inicio: fechaInicio, fecha_fin: fechaFin}
    this.academicoService.CicloEscolarCreateApi(cicloEscolar).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Ciclo escolar creado exitosamente',
          severity: 'success',
        });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (error) => {
        const detail = error.error.detail || "Ocurrió un error al crear el ciclo escolar";
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }
}
