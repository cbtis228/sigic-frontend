import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ServicioSocialCreate } from '../../../../../interfaces/academico.interface';
import { AlumnoAutocompleteComponent } from '../alumno-autocomplete/alumno-autocomplete.component';

@Component({
  selector: 'app-servicio-social-create-dialog',
  imports: [
    DialogModule,
    DatePicker,
    InputTextModule,
    TextareaModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    SelectModule,
    AlumnoAutocompleteComponent,
  ],
  templateUrl: './servicio-social-create-dialog.component.html',
  styleUrl: './servicio-social-create-dialog.component.scss',
})
export class ServicioSocialCreateDialogComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onServicioSocialCreate: EventEmitter<ServicioSocialCreate> =
    new EventEmitter();


  servicioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.servicioForm = this.fb.group({
      alumno: [null, Validators.required],
      actividad: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null],
      responsable: [null, Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.servicioForm.reset({
        horas_acumuladas: 0,
        evidencia: '',
      });
    }
  }

  onSubmit() {
    const formValue = this.servicioForm.value;
    const objServicioSocialCreate: ServicioSocialCreate = {
      ...formValue,
      alumno: formValue.alumno.numero_control,
      fecha_inicio: formValue.fecha_inicio.toISOString().split('T')[0],
      fecha_fin: formValue.fecha_fin
        ? formValue.fecha_fin.toISOString().split('T')[0]
        : null,
    };
    this.onServicioSocialCreate.emit(objServicioSocialCreate);
  }
}
