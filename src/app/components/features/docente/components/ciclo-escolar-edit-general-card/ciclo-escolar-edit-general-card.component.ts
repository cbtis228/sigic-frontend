import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { SelectModule } from 'primeng/select';
import {
  CicloEscolar,
  CicloEscolarUpdate,
} from '../../../../../interfaces/academico.interface';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { endDateAfterStartDateValidator } from '../../../../../validators/end-date-after-start-date';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-ciclo-escolar-edit-general-card',
  imports: [
    CommonModule,
    CardWithTitleComponent,
    InputTextModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './ciclo-escolar-edit-general-card.component.html',
  styleUrl: './ciclo-escolar-edit-general-card.component.scss',
})
export class CicloEscolarEditGeneralCardComponent implements OnChanges {
  @Input() cicloEscolar!: CicloEscolar;
  @Input() showSkeletons: boolean = true;
  @Output() updatedCicloEscolar: EventEmitter<CicloEscolarUpdate> =
    new EventEmitter<CicloEscolarUpdate>();

  cicloEscolarForm: FormGroup;
  estadosCiclo = ESTADOS_GENERALES;

  constructor(private formBuilder: FormBuilder) {
    this.cicloEscolarForm = this.formBuilder.group(
      {
        nombre_ciclo: ['', Validators.required],
        fecha_inicio: [null, Validators.required],
        fecha_fin: [null, Validators.required],
        estatus: [null, Validators.required],
      },
      { validators: endDateAfterStartDateValidator },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cicloEscolar'] && this.cicloEscolar) {
      const cicloData = {
        ...this.cicloEscolar,
        fecha_inicio: this.toLocalDate(this.cicloEscolar.fecha_inicio),
        fecha_fin: this.toLocalDate(this.cicloEscolar.fecha_fin),
      };

      this.cicloEscolarForm.patchValue(cicloData);
    }
  }

  toLocalDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d); // mes en Date es 0-indexado
  }

  calcularDuracion(): string {
    const fechaInicio = this.cicloEscolarForm.get('fecha_inicio')?.value;
    const fechaFin = this.cicloEscolarForm.get('fecha_fin')?.value;

    if (!fechaInicio || !fechaFin) return '';

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const meses = Math.floor(diffDays / 30);
    const diasRestantes = diffDays % 30;

    if (meses > 0) {
      return `${meses} mes(es) y ${diasRestantes} día(s)`;
    }

    return `${diffDays} días`;
  }

  onSubmit(): void {
    if (this.cicloEscolarForm.valid) {
      const formValue = this.cicloEscolarForm.value;

      const updatedCiclo: CicloEscolarUpdate = {
        ...formValue,
        fecha_inicio: formValue.fecha_inicio
          ? formValue.fecha_inicio.toISOString().split('T')[0]
          : null,
        fecha_fin: formValue.fecha_fin
          ? formValue.fecha_fin.toISOString().split('T')[0]
          : null,
      };

      this.updatedCicloEscolar.emit(updatedCiclo);
    }
  }
}
