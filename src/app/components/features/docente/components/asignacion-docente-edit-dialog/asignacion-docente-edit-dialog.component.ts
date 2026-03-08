import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { AsignacionDocente, AsignacionDocenteUpdate, CicloEscolar } from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { GrupoAutocompleteComponent } from '../grupo-autocomplete/grupo-autocomplete.component';
import { MateriaAutocompleteComponent } from '../materia-autocomplete/materia-autocomplete.component';
import { CicloEscolarAutocompleteComponent } from '../ciclo-escolar-autocomplete/ciclo-escolar-autocomplete.component';
import { DocenteAutocompleteComponent } from '../docente-autocomplete/docente-autocomplete.component';

@Component({
  selector: 'app-asignacion-docente-edit-dialog',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    MateriaAutocompleteComponent,
    DocenteAutocompleteComponent,
    CicloEscolarAutocompleteComponent
  ],
  templateUrl: './asignacion-docente-edit-dialog.component.html',
  styleUrl: './asignacion-docente-edit-dialog.component.scss'
})
export class AsignacionDocenteEditDialogComponent implements OnChanges {
  estatuses = ESTADOS_GENERALES;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() asignacion: AsignacionDocente | null = null;
  @Output() onAsignacionUpdate = new EventEmitter<AsignacionDocenteUpdate>();

  cicloEscolar: CicloEscolar | null = null

  asignacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.asignacionForm = this.fb.group({
      docente: [null, Validators.required],
      ciclo_escolar: [null, Validators.required],
      materia: [null, Validators.required],
      estatus: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asignacion'] && this.asignacion || changes['visible'] && this.visible == true) {
      this.asignacionForm.patchValue({
        ciclo_escolar: this.asignacion?.ciclo_escolar,
        docente: this.asignacion?.docente,
        materia: this.asignacion?.materia,
        estatus: this.asignacion?.estatus,
      });
    }
  }

  onSubmit() {
    if (this.asignacionForm.invalid) return;

    const formValue = this.asignacionForm.value;
    const objServicioUpdate: AsignacionDocenteUpdate = {
      docente: formValue.docente?.id_docente ?? this.asignacion?.docente?.id_docente,
      ciclo_escolar: formValue.ciclo_escolar?.id ?? this.asignacion?.ciclo_escolar?.id,
      materia: formValue.materia?.id ?? this.asignacion?.materia?.id,
      estatus: formValue.estatus ?? this.asignacion?.estatus,
    };
    this.onAsignacionUpdate.emit(objServicioUpdate);
  }
}
