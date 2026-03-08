import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  Validator,
  FormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  Inscripcion,
  InscripcionListFilterRequest,
} from '../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../services/academico.service';

@Component({
  selector: 'app-inscripcion-autocomplete',
  templateUrl: './inscripcion-autocomplete.component.html',
  styleUrl: './inscripcion-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InscripcionAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InscripcionAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [AutoCompleteModule, FormsModule],
})
export class InscripcionAutocompleteComponent
  implements ControlValueAccessor, Validator
{
  @Input() placeholder: string = 'Seleccione un inscripcion';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  inscripciones: Inscripcion[] = [];
  selectedInscripcion: (Inscripcion & { label?: string }) | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private academicoService: AcademicoService,
    private messageService: MessageService,
  ) {}

  filterInscripcions(event: any): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      global_filter: event.query,
    } as InscripcionListFilterRequest;

    this.academicoService.InscripcionListApi('', '', filter).subscribe({
      next: (response) => {
        this.inscripciones = response.results;
        const isInscripcionOnInscripcionsList = this.inscripciones.find(
          (d) => d.id == this.selectedInscripcion?.id,
        );
        if (!isInscripcionOnInscripcionsList && this.selectedInscripcion) {
          this.inscripciones.push(this.selectedInscripcion);
        }
        this.inscripciones = this.inscripciones.map((inscripcion) => ({
          ...inscripcion,
          label: `${inscripcion.grupo.nombre_grupo} - ${inscripcion.alumno.nombres} ${inscripcion.alumno.paterno} ${inscripcion.alumno.materno}`,
        }));
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar las inscripciones',
          severity: 'error',
        });
      },
    });
  }

  onInscripcionSelect(event: any): void {
    this.selectedInscripcion = event.value;
    this.onChange(this.selectedInscripcion);
    this.onTouched();
  }

  onInscripcionClear(): void {
    this.selectedInscripcion = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: Inscripcion | null): void {
    if (value) {
      this.selectedInscripcion = {
        ...value!,
        label: `${value.grupo.nombre_grupo} - ${value.alumno.nombres} ${value.alumno.paterno} ${value.alumno.materno}`,
      };
    }
    else {
      this.selectedInscripcion = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: FormControl) {
    if (this.required && !control.value) {
      return { required: true };
    }
    return null;
  }
}
