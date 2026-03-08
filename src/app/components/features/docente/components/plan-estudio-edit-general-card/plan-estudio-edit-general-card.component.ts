import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
    Materia,
  PlanEstudio,
  PlanEstudioUpdate,
} from '../../../../../interfaces/academico.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { RouterModule } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { endDateAfterStartDateValidator } from '../../../../../validators/end-date-after-start-date';
import { MateriaAutocompleteComponent } from '../materia-autocomplete/materia-autocomplete.component';

@Component({
  selector: 'app-plan-estudio-edit-general-card',
  imports: [
    InputTextModule,
    CommonModule,
    SelectModule,
    RouterModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    ButtonModule,
    CardWithTitleComponent,
    MateriaAutocompleteComponent,
  ],
  templateUrl: './plan-estudio-edit-general-card.component.html',
  styleUrl: './plan-estudio-edit-general-card.component.scss',
})
export class PlanEstudioEditGeneralCardComponent {
  @Input() planEstudio!: PlanEstudio;
  @Input() showSkeletons: boolean = true;
  @Output() updatedPlanEstudio: EventEmitter<PlanEstudioUpdate> =
    new EventEmitter<PlanEstudioUpdate>();

  planEstudioForm: FormGroup;
  estadosPlanEstudio = ESTADOS_GENERALES;

  constructor(private formBuilder: FormBuilder) {
    this.planEstudioForm = this.formBuilder.group(
      {
        nombre: [null, Validators.required],
        nivel: [null, Validators.required],
        vigencia_inicio: [null, Validators.required],
        vigencia_fin: [null, Validators.required],
        materias: [[], [Validators.required, Validators.minLength(1)]],
        estatus: [null, Validators.required],
      },
      { validators: endDateAfterStartDateValidator },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['planEstudio'] && this.planEstudio) {
      this.planEstudioForm.patchValue({
        ...this.planEstudio,
        vigencia_inicio: this.toLocalDate(this.planEstudio.vigencia_inicio),
        vigencia_fin: this.toLocalDate(this.planEstudio.vigencia_fin),
      });
    }
  }

  toLocalDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

onSubmit(): void {
  if (this.planEstudioForm.valid) {
    const formValue = this.planEstudioForm.value;
    const updatePlanEstudioObj = {
      ...formValue,
      vigencia_inicio: formValue.vigencia_inicio.toISOString().split('T')[0],
      vigencia_fin: formValue.vigencia_fin.toISOString().split('T')[0],
      materias: formValue.materias.map((m: Materia) => m.id)
    } as PlanEstudioUpdate;
    this.updatedPlanEstudio.emit(updatePlanEstudioObj);
  }
}
}
