import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ErrorService } from '../../../../../../../services/error.service';
import { CicloEscolarListFilterRequest } from '../../../../../../../interfaces/academico.interface';
import { DocenteService } from '../../../../../../../services/docente.service';
import { DocenteListFilterRequest } from '../../../../../../../interfaces/docente.interface';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';

@Component({
  selector: 'app-create-grupo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardWithTitleComponent,
    RouterModule,
    InputTextModule,
    ButtonModule,
    AutoCompleteModule,
    InputNumberModule,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  ciclos: any[] = [];
  docentes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private academicoService: AcademicoService,
    private docenteService: DocenteService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      ciclo_escolar: [null, Validators.required],
      docente: [null, Validators.required],
      nombre_grupo: ['', Validators.required],
      nivel: ['', Validators.required],
      turno: ['', Validators.required],
      capacidad_maxima: [''],
      anio_escolar: [new Date().getFullYear(), Validators.required],
      periodo: ['', Validators.required],
    });
  }

  filterCiclos(event: AutoCompleteCompleteEvent): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      global_filter: event.query,
    } as CicloEscolarListFilterRequest;
    this.academicoService.CicloEscolarListApi('', '', filter).subscribe({
      next: (response) => {
        this.ciclos = response.results;
        this.ciclos.forEach((c) => c.id = String(c.id));
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar ciclos escolares',
          severity: 'error',
        });
      },
    });
  }

  filterDocentes(event: AutoCompleteCompleteEvent): void {
    const filter = {
      estatus: [{ value: '1', matchMode: 'equals', operator: 'and' }],
      global_filter: event.query,
    } as DocenteListFilterRequest;
    this.docenteService.DocenteListApi('', '', filter).subscribe({
      next: (response) => {
        this.docentes = response.results;
        this.docentes.forEach((d) => {
          d.nombre_completo = d.nombres + ' ' + d.paterno + ' ' + d.materno;
          d.id_docente = String(d.id_docente);
        });
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar ciclos escolares',
          severity: 'error',
        });
      },
    });
  }

  onGrupoSave(): void {
    if (this.form.invalid) return;

    const grupoData = {
      ...this.form.value,
      capacidad_maxima: this.form.value.capacidad_maxima
        ? parseInt(this.form.value.capacidad_maxima)
        : null,
      anio_escolar: parseInt(this.form.value.anio_escolar),
    };

    this.academicoService.GrupoCreateApi(grupoData).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Grupo creado exitosamente',
          severity: 'success',
        });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }
}
