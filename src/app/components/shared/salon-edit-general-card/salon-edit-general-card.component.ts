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
import { SelectModule } from 'primeng/select';
import { CardWithTitleComponent } from '../card-with-title/card-with-title.component';
import { Salon, SalonUpdate } from '../../../interfaces/academico.interface';
import { ESTADOS_GENERALES, TIPO_SALON } from '../../../global.constants';

@Component({
  selector: 'app-salon-edit-general-card',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    RouterLink,
    SelectModule,
    CardWithTitleComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './salon-edit-general-card.component.html',
  styleUrl: './salon-edit-general-card.component.scss',
})
export class SalonEditGeneralCardComponent implements OnChanges {
  @Input() salon!: Salon;
  @Input() showSkeletons = true;

  @Output() updatedSalon = new EventEmitter<SalonUpdate>();

  salonForm: FormGroup;
  estadosGenerales = ESTADOS_GENERALES;
  tiposSalon = TIPO_SALON;

  constructor(private fb: FormBuilder) {
    this.salonForm = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: [''],
      capacidad: [null],
      tipo: [null, Validators.required],
      estatus: [null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['salon'] && this.salon) {
      this.salonForm.patchValue({ ...this.salon });
    }
  }

  onSubmit() {
    if (this.salonForm.valid) {
      this.updatedSalon.emit(this.salonForm.value);
    }
  }
}

