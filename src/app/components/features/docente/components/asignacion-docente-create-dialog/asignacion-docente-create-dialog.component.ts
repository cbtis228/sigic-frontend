import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AsignacionDocenteCreate, CicloEscolar } from '../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MateriaAutocompleteComponent } from '../materia-autocomplete/materia-autocomplete.component';
import { DocenteAutocompleteComponent } from '../docente-autocomplete/docente-autocomplete.component';
import { GrupoAutocompleteComponent } from '../grupo-autocomplete/grupo-autocomplete.component';
import { CicloEscolarAutocompleteComponent } from "../ciclo-escolar-autocomplete/ciclo-escolar-autocomplete.component";

@Component({
  selector: 'app-asignacion-docente-create-dialog',
    imports: [
    DialogModule,
    InputTextModule,
    TextareaModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    SelectModule,
    MateriaAutocompleteComponent,
    CicloEscolarAutocompleteComponent,
    DocenteAutocompleteComponent,
    CicloEscolarAutocompleteComponent
],
  templateUrl: './asignacion-docente-create-dialog.component.html',
  styleUrl: './asignacion-docente-create-dialog.component.scss'
})
export class AsignacionDocenteCreateDialogComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onAsignacionDocenteCreate: EventEmitter<AsignacionDocenteCreate> =
    new EventEmitter();


  cicloEscolar: CicloEscolar | null = null
  asignacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.asignacionForm = this.fb.group({
      docente: [null, Validators.required],
      materia: [null, Validators.required],
      ciclo_escolar: [null, Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.asignacionForm.reset({
        horas_acumuladas: 0,
        evidencia: '',
      });
    }
  }

  onSubmit() {
    const formValue = this.asignacionForm.value;
    const objAsignacionDocenteCreate: AsignacionDocenteCreate = {
      ciclo_escolar: formValue.ciclo_escolar.id,
      docente: formValue.docente.id_docente,
      materia: formValue.materia.id,
    };
    this.onAsignacionDocenteCreate.emit(objAsignacionDocenteCreate);
  }
}
