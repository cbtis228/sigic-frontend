import { Component, forwardRef, Input, OnInit } from '@angular/core';
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
import { CicloEscolar, CicloEscolarListFilterRequest } from '../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../services/academico.service';

@Component({
  selector: 'app-ciclo-escolar-autocomplete',
  templateUrl: './ciclo-escolar-autocomplete.component.html',
  styleUrl: './ciclo-escolar-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CicloEscolarAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CicloEscolarAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [AutoCompleteModule, FormsModule],
})
export class CicloEscolarAutocompleteComponent
  implements ControlValueAccessor, Validator
{
  @Input() placeholder: string = 'Seleccione un ciclo escolar';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  ciclosEscolares: CicloEscolar[] = [];
  selectedCicloEscolar: CicloEscolar | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private academicoService: AcademicoService,
    private messageService: MessageService,
  ) {}

  filterCicloEscolares(event: any): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      global_filter: event.query,
    } as CicloEscolarListFilterRequest;

    this.academicoService.CicloEscolarListApi('', '', filter).subscribe({
      next: (response) => {
        this.ciclosEscolares = response.results;
        const isCicloEscolarOnCiclosEscolaresList = this.ciclosEscolares.find(
          (c) => c.id == this.selectedCicloEscolar?.id,
        );
        if (!isCicloEscolarOnCiclosEscolaresList && this.selectedCicloEscolar) {
          this.ciclosEscolares.push(this.selectedCicloEscolar);
        }
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar los ciclos escolares',
          severity: 'error',
        });
      },
    });
  }

  onCicloEscolarSelect(event: any): void {
    this.selectedCicloEscolar = event.value;
    this.onChange(this.selectedCicloEscolar);
    this.onTouched();
  }

  onCicloEscolarClear(): void {
    this.selectedCicloEscolar = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: CicloEscolar | null): void {
    this.selectedCicloEscolar = value
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
