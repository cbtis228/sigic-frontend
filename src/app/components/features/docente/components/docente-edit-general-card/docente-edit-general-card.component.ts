import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { optionalRequiredLengthValidator } from '../../../../../validators/optional-min-lenght';
import { Docente, DocenteUpdate } from '../../../../../interfaces/docente.interface';
import { ESTADOS_DOCENTE } from '../../../../../global.constants';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-docente-edit-general-card',
  imports: [
    CommonModule,
    CardWithTitleComponent,
    InputTextModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './docente-edit-general-card.component.html',
  styleUrl: './docente-edit-general-card.component.scss',
})
export class DocenteEditGeneralCardComponent implements OnChanges {
  @Input() docente!: Docente;
  @Input() showStatus: boolean = false;
  @Input() showSkeletons: boolean = true;
  @Output() updatedDocente: EventEmitter<DocenteUpdate> =
    new EventEmitter<DocenteUpdate>();
  docenteForm: FormGroup;
  estadosDocente = ESTADOS_DOCENTE

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.docenteForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      paterno: ['', Validators.required],
      materno: ['', Validators.required],
      telefono: [''],
      domicilio: [''],
      celular: [''],
      rfc: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
        ],
      ],
      cedula_profesional: ['', optionalRequiredLengthValidator(20)],
      estatus: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['docente'] && this.docente) {
      this.docenteForm.patchValue(this.docente);
    }
  }

  onSubmit(): void {
    const updatedDocente = this.docenteForm.getRawValue() as Docente;
    this.updatedDocente.emit(updatedDocente)
  }
}
