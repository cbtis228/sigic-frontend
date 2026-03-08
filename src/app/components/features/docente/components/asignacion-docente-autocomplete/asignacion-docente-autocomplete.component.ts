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
  AsignacionDocente,
  AsignacionDocenteListFilterRequest,
  CicloEscolar,
  Grupo,
} from '../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../services/academico.service';

@Component({
  selector: 'app-asignacion-docente-autocomplete',
  imports: [AutoCompleteModule, FormsModule],
  templateUrl: './asignacion-docente-autocomplete.component.html',
  styleUrl: './asignacion-docente-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsignacionDocenteAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AsignacionDocenteAutocompleteComponent),
      multi: true,
    },
  ],
})
export class AsignacionDocenteAutocompleteComponent
  implements ControlValueAccessor, Validator
{
  @Input() placeholder: string = 'Seleccione una asignacion docente';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() estatus: string | null = '1';
  @Input() cicloEscolar: CicloEscolar['id'] | null = null;

  AsignacionDocentes: (AsignacionDocente & { label?: string })[] = [];
  selectedAsignacionDocente: (AsignacionDocente & { label?: string }) | null =
    null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private academicoService: AcademicoService,
    private messageService: MessageService
  ) {}

  filterAsignacionDocentes(event: any): void {
    const filter = {
      global_filter: event.query,
    } as AsignacionDocenteListFilterRequest;

    if (this.estatus) {
      filter.estatus = [
        { value: this.estatus, matchMode: 'equals', operator: 'and' },
      ];
    }

    if (this.cicloEscolar) {
      filter.ciclo_escolar__id = [
        { value: this.cicloEscolar, matchMode: 'equals', operator: 'and' },
      ];
    }

    this.academicoService.AsignacionDocenteListApi('', '', filter).subscribe({
      next: (response) => {
        this.AsignacionDocentes = response.results;
        const isAsignacionDocenteOnAsignacionDocentesList =
          this.AsignacionDocentes.find(
            (d) => d.id == this.selectedAsignacionDocente?.id
          );
        if (
          !isAsignacionDocenteOnAsignacionDocentesList &&
          this.selectedAsignacionDocente
        ) {
          this.AsignacionDocentes.push(this.selectedAsignacionDocente);
        }
        this.AsignacionDocentes.forEach(
          (a) =>
            (a.label = `${a.ciclo_escolar.nombre_ciclo} - ${a.materia.nombre} - ${a.docente.nombres} ${a.docente.paterno} ${a.docente.materno}`)
        );
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar los AsignacionDocentes',
          severity: 'error',
        });
      },
    });
  }

  onAsignacionDocenteSelect(event: any): void {
    this.selectedAsignacionDocente = event.value;
    this.onChange(this.selectedAsignacionDocente);
    this.onTouched();
  }

  onAsignacionDocenteClear(): void {
    this.selectedAsignacionDocente = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: AsignacionDocente | null): void {
    this.selectedAsignacionDocente = value;
    if (this.selectedAsignacionDocente) {
      const a = this.selectedAsignacionDocente;
      a.label = `${a.ciclo_escolar.nombre_ciclo} - ${a.materia.nombre} - ${a.docente.nombres} ${a.docente.paterno} ${a.docente.materno}`;
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
