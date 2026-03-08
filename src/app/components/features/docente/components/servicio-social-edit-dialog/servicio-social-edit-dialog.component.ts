import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { ServicioSocial, ServicioSocialUpdate } from '../../../../../interfaces/academico.interface';
import { AlumnoAutocompleteComponent } from '../alumno-autocomplete/alumno-autocomplete.component';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-servicio-social-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    DatePicker,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    AlumnoAutocompleteComponent
  ],
  templateUrl: './servicio-social-edit-dialog.component.html',
  styleUrls: ['./servicio-social-edit-dialog.component.scss'],
})
export class ServicioSocialEditDialogComponent implements OnChanges {
  estatuses = ESTADOS_GENERALES;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() servicio: ServicioSocial | null = null;
  @Output() onServicioUpdate = new EventEmitter<ServicioSocialUpdate>();

  servicioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.servicioForm = this.fb.group({
      alumno: [null, Validators.required],
      actividad: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null],
      responsable: [null, Validators.required],
      estatus: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicio'] && this.servicio) {
      this.servicioForm.patchValue({
        alumno: this.servicio.alumno,
        actividad: this.servicio.actividad,
        fecha_inicio: new Date(this.servicio.fecha_inicio),
        fecha_fin: this.servicio.fecha_fin ? new Date(this.servicio.fecha_fin) : null,
        horas_acumuladas: this.servicio.horas_acumuladas,
        responsable: this.servicio.responsable,
        evidencia: this.servicio.evidencia,
        estatus: this.servicio.estatus,
      });
    }
  }

  onSubmit() {
    if (this.servicioForm.invalid) return;

    const formValue = this.servicioForm.value;
    const objServicioUpdate: ServicioSocialUpdate = {
      ...formValue,
      alumno: formValue.alumno?.numero_control ?? this.servicio?.alumno?.numero_control,
      fecha_inicio: formValue.fecha_inicio?.toISOString().split('T')[0],
      fecha_fin: formValue.fecha_fin ? formValue.fecha_fin.toISOString().split('T')[0] : null,
    };
    this.onServicioUpdate.emit(objServicioUpdate);
  }
}

