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
import { AcademicoService } from '../../../../../services/academico.service';
import {
  CicloEscolar,
  Grupo,
  GrupoListFilterRequest,
} from '../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-grupo-autocomplete',
  templateUrl: './grupo-autocomplete.component.html',
  styleUrl: './grupo-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GrupoAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GrupoAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [AutoCompleteModule, FormsModule],
})
export class GrupoAutocompleteComponent
  implements ControlValueAccessor, Validator
{
  @Input() placeholder: string = 'Seleccione un grupo';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() estatus: string | null = '1';
  @Input() cicloEscolar: CicloEscolar['id'] | null = null;

  grupos: Grupo[] = [];
  selectedGrupo: (Grupo & { nombre_completo?: string }) | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private academicoService: AcademicoService,
    private messageService: MessageService,
  ) {}

  filterGrupos(event: any): void {
    const filter = {
      global_filter: event.query,
    } as GrupoListFilterRequest;

    if (this.estatus) {
      filter.estatus = [
        { value: this.estatus, matchMode: 'equals', operator: 'and' },
      ];
    }

    if(this.cicloEscolar){
      filter.ciclo_escolar__id = [
        { value: this.cicloEscolar, matchMode: 'equals', operator: 'and' },
      ];
    }

    this.academicoService.GrupoListApi('', '', filter).subscribe({
      next: (response) => {
        this.grupos = response.results;
        const isGrupoOnGruposList = this.grupos.find(
          (d) => d.id == this.selectedGrupo?.id,
        );
        if (!isGrupoOnGruposList && this.selectedGrupo) {
          this.grupos.push(this.selectedGrupo);
        }
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar los grupos',
          severity: 'error',
        });
      },
    });
  }

  onGrupoSelect(event: any): void {
    this.selectedGrupo = event.value;
    this.onChange(this.selectedGrupo);
    this.onTouched();
  }

  onGrupoClear(): void {
    this.selectedGrupo = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: Grupo | null): void {
    this.selectedGrupo = value;
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
