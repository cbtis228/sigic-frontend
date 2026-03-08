import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Docente } from '../../../../../../../interfaces/docente.interface';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { DocenteService } from '../../../../../../../services/docente.service';
import { emailFormatValidator } from '../../../../../../../validators/email-format';
import { ErrorService } from '../../../../../../../services/error.service';

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
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
    private docenteService: DocenteService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombres: ['elpepe', Validators.required],
      paterno: ['elpepe', Validators.required],
      materno: ['elpepe', Validators.required],
      correo: ['elpepe@elpepe.com', [Validators.required, Validators.email, emailFormatValidator()]],
      telefono: [''],
      celular: [''],
      domicilio: [''],
      rfc: [
        'elpepe',
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.maxLength(13),
        ],
      ],
      cedula_profesional: [
        'elpepe',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  onDocenteSave(): void {
    if (this.form.invalid) return;

    const docente: Docente = this.form.value;

    this.docenteService.DocenteCreateApi(docente).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Docente creado exitosamente',
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
