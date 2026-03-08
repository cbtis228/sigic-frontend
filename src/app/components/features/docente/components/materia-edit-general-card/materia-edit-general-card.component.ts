import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GrupoUpdate,
  Materia,
  MateriaUpdate,
} from '../../../../../interfaces/academico.interface';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-materia-edit-general-card',
  imports: [
    InputTextModule,
    CommonModule,
    SelectModule,
    RouterModule,
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    CardWithTitleComponent,
    TextareaModule
  ],
  templateUrl: './materia-edit-general-card.component.html',
  styleUrl: './materia-edit-general-card.component.scss',
})
export class MateriaEditGeneralCardComponent {
  @Input() materia!: Materia;
  @Input() showSkeletons: boolean = true;
  @Output() updatedMateria: EventEmitter<GrupoUpdate> =
    new EventEmitter<MateriaUpdate>();

  materiaForm: FormGroup;
  estadosMateria = ESTADOS_GENERALES;

  constructor(private formBuilder: FormBuilder) {
    this.materiaForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      creditos: [null],
      horas_teorica: [null],
      horas_practica: [null],
      seriacion: [''],
      estatus: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materia'] && this.materia) {
      this.materiaForm.patchValue(this.materia);
    }
  }

  onSubmit(): void {
    if (this.materiaForm.valid) {
      const formValue = this.materiaForm.value;
      const updateMateriaObj = {
        ...formValue,
      } as MateriaUpdate;
      this.updatedMateria.emit(updateMateriaObj);
    }
  }
}
