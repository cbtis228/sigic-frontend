import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../services/error.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Materia, PlanEstudioCreate } from '../../../../../../../interfaces/academico.interface';
import { endDateAfterStartDateValidator } from '../../../../../../../validators/end-date-after-start-date';
import { MateriaAutocompleteComponent } from '../../../../components/materia-autocomplete/materia-autocomplete.component';
import { CommonModule } from '@angular/common';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-create',
  imports: [
    MateriaAutocompleteComponent,
    CommonModule,
    ReactiveFormsModule,
    CardWithTitleComponent,
    RouterModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  form!: FormGroup;

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
    this.form = this.fb.group(
      {
        nombre: [null, Validators.required],
        nivel: [null, Validators.required],
        vigencia_inicio: [null, Validators.required],
        vigencia_fin: [null, Validators.required],
        materias: [[], [Validators.required, Validators.minLength(1)]],
      },
      { validators: endDateAfterStartDateValidator },
    );
  }

  onPlanEstudioSave(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const planEstudioData = {
      ...formValue,
      vigencia_inicio: formValue.vigencia_inicio.toISOString().split('T')[0],
      vigencia_fin: formValue.vigencia_fin.toISOString().split('T')[0],
      materias: formValue.materias.map((m: Materia) => m.id),
    } as PlanEstudioCreate;

    this.academicoService.PlanEstudioCreateApi(planEstudioData).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Plan de estudio creado exitosamente',
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
