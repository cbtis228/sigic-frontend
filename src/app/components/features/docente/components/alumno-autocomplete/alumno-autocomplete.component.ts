import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  Validator,
  FormsModule,
} from '@angular/forms';
import {
  Alumno,
  AlumnoListFilterRequest,
} from '../../../../../interfaces/alumno.interface';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AlumnosService } from '../../../../../services/alumnos.service';

@Component({
  selector: 'app-alumno-autocomplete',
  templateUrl: './alumno-autocomplete.component.html',
  styleUrl: './alumno-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AlumnoAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AlumnoAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [AutoCompleteModule, FormsModule],
})
export class AlumnoAutocompleteComponent
  implements ControlValueAccessor, Validator
{
  @Input() placeholder: string = 'Seleccione un alumno';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() estatus: string | null = '1';

  alumnos: Alumno[] = [];
  selectedAlumno: (Alumno & { nombre_completo?: string }) | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
  ) {}

  filterAlumnos(event: any): void {
    const filter = {
      global_filter: event.query,
    } as AlumnoListFilterRequest;

   if (this.estatus) {
      filter.estatus = [
        { value: this.estatus, matchMode: 'equals', operator: 'and' },
      ];
    }

    this.alumnoService.AlumnoListApi('', '', filter).subscribe({
      next: (response) => {
        this.alumnos = response.results;
        const isAlumnoOnAlumnosList = this.alumnos.find(
          (d) => d.numero_control == this.selectedAlumno?.numero_control,
        );
        if (!isAlumnoOnAlumnosList && this.selectedAlumno) {
          this.alumnos.push(this.selectedAlumno);
        }
        this.alumnos = this.alumnos.map((alumno) => ({
          ...alumno,
          nombre_completo: `${alumno.nombres} ${alumno.paterno} ${alumno.materno}`,
        }));
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar los alumnos',
          severity: 'error',
        });
      },
    });
  }

  onAlumnoSelect(event: any) {
    this.selectedAlumno = event.value;
    this.onChange(this.selectedAlumno);
    this.onTouched();
  }

  onAlumnoClear(): void {
    this.selectedAlumno = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: Alumno | null): void {
    if (value) {
      this.selectedAlumno = {
        ...value!,
        nombre_completo: `${value?.nombres} ${value?.paterno} ${value?.materno}`,
      };
    } else {
      this.selectedAlumno = null;
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
