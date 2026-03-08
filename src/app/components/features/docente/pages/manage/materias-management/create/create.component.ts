import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../services/error.service';
import { MateriaCreate } from '../../../../../../../interfaces/academico.interface';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-create-materia',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardWithTitleComponent,
    RouterModule,
    InputTextModule,
    ButtonModule,
    AutoCompleteModule,
    InputNumberModule,
    TextareaModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  materias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private academicoService: AcademicoService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      creditos: [null],
      horas_teorica: [null],
      horas_practica: [null],
      seriacion: [''],
    });
  }

  onMateriaSave(): void {
    if (this.form.invalid) return;

    const materiaData = {
      ...this.form.value,
    } as MateriaCreate;

    this.academicoService.MateriaCreateApi(materiaData).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Materia creada exitosamente',
          severity: 'success',
        });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }
}
