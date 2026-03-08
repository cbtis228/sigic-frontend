import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CicloEscolar,
  Grupo,
  GrupoUpdate,
} from '../../../../../interfaces/academico.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { CommonModule } from '@angular/common';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { SelectModule } from 'primeng/select';
import { Docente } from '../../../../../interfaces/docente.interface';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DocenteAutocompleteComponent } from '../docente-autocomplete/docente-autocomplete.component';
import { CicloEscolarAutocompleteComponent } from '../ciclo-escolar-autocomplete/ciclo-escolar-autocomplete.component';

@Component({
  selector: 'app-grupo-edit-general-card',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    SelectModule,
    CardWithTitleComponent,
    CicloEscolarAutocompleteComponent,
    DocenteAutocompleteComponent,
  ],
  templateUrl: './grupo-edit-general-card.component.html',
  styleUrl: './grupo-edit-general-card.component.scss',
})
export class GrupoEditGeneralCardComponent {
  @Input() grupo!: Grupo;
  @Input() showSkeletons: boolean = true;
  @Output() updatedGrupo: EventEmitter<GrupoUpdate> =
    new EventEmitter<GrupoUpdate>();

  grupoForm: FormGroup;
  estadosCiclo = ESTADOS_GENERALES;
  ciclosEscolares: CicloEscolar[] = [];
  docentes: Docente[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.grupoForm = this.formBuilder.group({
      ciclo_escolar: [null, Validators.required],
      docente: [null, Validators.required],
      nombre_grupo: ['', Validators.required],
      nivel: ['', Validators.required],
      turno: ['', Validators.required],
      capacidad_maxima: [0],
      anio_escolar: [0, Validators.required],
      periodo: [''],
      estatus: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupo'] && this.grupo) {
      this.grupoForm.patchValue(this.grupo);
    }
  }

  onSubmit(): void {
    if (this.grupoForm.valid) {
      const formValue = this.grupoForm.value;
      const updateGrupoObj = {
        ...formValue,
        docente: formValue.docente.id_docente,
        ciclo_escolar: formValue.ciclo_escolar.id,
      } as GrupoUpdate;
      this.updatedGrupo.emit(updateGrupoObj);
    }
  }
}
