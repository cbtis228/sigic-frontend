import { Component, forwardRef, Input } from '@angular/core';
import {
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  Materia,
  MateriaListFilterRequest,
} from '../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../services/academico.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-materia-autocomplete',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MateriaAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MateriaAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [AutoCompleteModule, FormsModule],
  templateUrl: './materia-autocomplete.component.html',
  styleUrl: './materia-autocomplete.component.scss',
})
export class MateriaAutocompleteComponent {
  @Input() placeholder: string = 'Seleccione una materia';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() multiple: boolean = false;

  materias: Materia[] = [];
  selectedMateria: Materia[] | Materia | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private academicoService: AcademicoService,
    private messageService: MessageService,
  ) {}

  pushSelectedMateria() {
    if (!this.selectedMateria) return;

    const materiasToAdd = Array.isArray(this.selectedMateria)
      ? this.selectedMateria
      : [this.selectedMateria];

    materiasToAdd.forEach((materia) => {
      if (materia?.id && !this.materias.some((m) => m.id === materia.id)) {
        this.materias.push({ ...materia });
      }
    });
  }
  filterMaterias(event: any): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      global_filter: event.query,
    } as MateriaListFilterRequest;

    this.academicoService.MateriaListApi('', '', filter).subscribe({
      next: (response) => {
        this.materias = response.results;
        this.pushSelectedMateria();
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar las materias',
          severity: 'error',
        });
      },
    });
  }

  onMateriaSelect(event: any): void {
    this.onChange(this.selectedMateria);
    this.onTouched();
  }

  onMateriaUnselect(event: any): void {
    this.onChange(this.selectedMateria);
    this.onTouched();
  }

  onMateriaClear(): void {
    this.selectedMateria = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: Materia[] | null): void {
    this.selectedMateria = value;
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
