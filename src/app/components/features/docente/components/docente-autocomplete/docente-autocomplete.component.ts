import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  Validator,
  NgModel,
  FormsModule,
} from '@angular/forms';
import {
  Docente,
  DocenteListFilterRequest,
} from '../../../../../interfaces/docente.interface';
import { DocenteService } from '../../../../../services/docente.service';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-docente-autocomplete',
  templateUrl: './docente-autocomplete.component.html',
  styleUrl: './docente-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocenteAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DocenteAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [AutoCompleteModule, FormsModule],
})
export class DocenteAutocompleteComponent
  implements ControlValueAccessor, Validator
{
  @Input() placeholder: string = 'Seleccione un docente';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  docentes: Docente[] = [];
  selectedDocente: (Docente & { nombre_completo?: string }) | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private docenteService: DocenteService,
    private messageService: MessageService,
  ) {}

  filterDocentes(event: any): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      global_filter: event.query,
    } as DocenteListFilterRequest;

    this.docenteService.DocenteListApi('', '', filter).subscribe({
      next: (response) => {
        this.docentes = response.results;
        const isDocenteOnDocentesList = this.docentes.find(
          (d) => d.id_docente == this.selectedDocente?.id_docente,
        );
        if (!isDocenteOnDocentesList && this.selectedDocente) {
          this.docentes.push(this.selectedDocente);
        }
        this.docentes = this.docentes.map((docente) => ({
          ...docente,
          nombre_completo: `${docente.nombres} ${docente.paterno} ${docente.materno}`,
        }));
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar los docentes',
          severity: 'error',
        });
      },
    });
  }

  onDocenteSelect(event: any): void {
    this.selectedDocente = event.value;
    this.onChange(this.selectedDocente);
    this.onTouched();
  }

  onDocenteClear(): void {
    this.selectedDocente = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: Docente | null): void {
    if (value) {
      this.selectedDocente = {
        ...value!,
        nombre_completo: `${value?.nombres} ${value?.paterno} ${value?.materno}`,
      };
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
