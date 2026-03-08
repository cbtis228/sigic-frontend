import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import {
  CicloEscolar,
  Grupo,
  GrupoListFilterRequest,
  InscripcionCreate,
} from '../../../../../interfaces/academico.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Alumno,
  AlumnoListFilterRequest,
} from '../../../../../interfaces/alumno.interface';
import { AlumnosService } from '../../../../../services/alumnos.service';
import { MessageService } from 'primeng/api';
import { AcademicoService } from '../../../../../services/academico.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-alumno-inscripcion-create-dialog',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    AutoCompleteModule,
    DatePickerModule,
  ],
  templateUrl: './alumno-inscripcion-create-dialog.component.html',
  styleUrl: './alumno-inscripcion-create-dialog.component.scss',
})
export class AlumnoInscripcionCreateDialogComponent {
  @Input() visible: boolean = false;
  @Input() cicloEscolar: CicloEscolar | null = null;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onInscripcionCreate: EventEmitter<InscripcionCreate> =
    new EventEmitter();

  grupoSeleccionado: Grupo | null = null;
  alumnos: Alumno[] = [];
  grupos: Grupo[] = [];

  inscripcionForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnosService,
    private academicoService: AcademicoService,
    private messageService: MessageService,
  ) {
    this.inscripcionForm = this.fb.group({
      alumno: [null, Validators.required],
      grupo: [null, Validators.required],
      fecha_inscripcion: [new Date()],
      observaciones: [''],
    });
  }

  filterAlumnos(event: AutoCompleteCompleteEvent): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      global_filter: event.query,
    } as AlumnoListFilterRequest;
    this.alumnoService.AlumnoListApi('', '', filter).subscribe({
      next: (response) => {
        this.alumnos = response.results;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los alumnos',
          severity: 'error',
        });
      },
    });
  }

  filterGrupos(event: any): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      ciclo_escolar__id: [
        { value: this.cicloEscolar?.id, matchMode: 'equals', operator: 'and' },
      ],
      global_filter: event.query,
    } as GrupoListFilterRequest;
    this.academicoService.GrupoListApi('', '', filter).subscribe({
      next: (response) => {
        this.grupos = response.results;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los grupos',
          severity: 'error',
        });
      },
    });
  }

  sendInscripcionCreate(): void {
    const formObj = this.inscripcionForm.getRawValue();
    const inscripcionCreateObj = {
      alumno: formObj.alumno.numero_control,
      grupo: formObj.grupo.id,
      fecha_inscripcion: formObj.fecha_inscripcion.toISOString().split('T')[0],
      observaciones: formObj.observaciones
    } as InscripcionCreate
    this.onInscripcionCreate.emit(inscripcionCreateObj)
  }
}
