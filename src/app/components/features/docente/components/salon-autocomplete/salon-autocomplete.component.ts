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
import { Salon, SalonListFilterRequest } from '../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../services/academico.service';

@Component({
  selector: 'app-salon-autocomplete',
  templateUrl: './salon-autocomplete.component.html',
  styleUrl: './salon-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SalonAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SalonAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [AutoCompleteModule, FormsModule],
})
export class SalonAutocompleteComponent
  implements ControlValueAccessor, Validator
{
  @Input() placeholder: string = 'Seleccione un salon';
  @Input() showClear: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() estatus: string | null = '1';

  salones: Salon[] = [];
  selectedSalon: (Salon & { nombre_completo?: string }) | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private salonService: AcademicoService,
    private messageService: MessageService,
  ) {}

  filterSalons(event: any): void {
    const filter = {
      global_filter: event.query,
    } as SalonListFilterRequest;

    if (this.estatus) {
      filter.estatus = [
        { value: this.estatus, matchMode: 'equals', operator: 'and' },
      ];
    }

    this.salonService.SalonListApi('', '', filter).subscribe({
      next: (response) => {
        this.salones = response.results;
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar los salones',
          severity: 'error',
        });
      },
    });
  }

  onSalonSelect(event: any) {
    this.selectedSalon = event.value;
    this.onChange(this.selectedSalon);
    this.onTouched();
  }

  onSalonClear(): void {
    this.selectedSalon = null;
    this.onChange(null);
    this.onTouched();
  }

  writeValue(value: Salon | null): void {
    this.selectedSalon = value;
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
