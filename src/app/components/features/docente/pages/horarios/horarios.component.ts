import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CicloEscolar,
  CicloEscolarListFilterRequest,
  Grupo,
  GrupoListFilterRequest,
  Horario,
} from '../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../services/academico.service';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../services/error.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { GrupoHorarioListComponent } from '../../components/grupo-horario-list/grupo-horario-list.component';
import {
  Docente,
  DocenteListFilterRequest,
} from '../../../../../interfaces/docente.interface';
import { DocenteService } from '../../../../../services/docente.service';

@Component({
  selector: 'app-horarios',
  imports: [
    CommonModule,
    PaginatorModule,
    InputTextModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    TabsModule,
    GrupoHorarioListComponent,
  ],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss',
})
export class HorariosComponent {
  cicloEscolar: CicloEscolar | null = null;
  ciclosEscolares: CicloEscolar[] = [];
  gruposData: PaginatedData<Grupo> | null = null;
  docentesData: PaginatedData<Docente> | null = null;
  today = new Date();
  grupoEstatusFilter: number | null = null;
  grupoGlobalFilter: string = '';
  docenteEstatusFilter: number | null = null;
  docenteGlobalFilter: string = '';
  estatuses = ESTADOS_GENERALES;
  selectedGrupo: Grupo | null = null;
  selectedGrupoHorarios: Horario[] = [];
  showHorarioDialog = false;

  constructor(
    private academicoService: AcademicoService,
    private docenteService: DocenteService,
    private messageService: MessageService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.academicoService
      .CicloEscolarListApi('', '', {} as CicloEscolarListFilterRequest, 0, 50)
      .subscribe({
        next: (response) => {
          this.ciclosEscolares = response.results;
          this.cicloEscolar =
            this.ciclosEscolares.find((c) => {
              const inicio = new Date(c.fecha_inicio);
              const fin = new Date(c.fecha_fin);
              return this.today >= inicio && this.today <= fin;
            }) || null;
          this.loadGrupos();
          this.loadDocentes();
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
  onHorarioGrupoDetailClick(grupo: Grupo) {
    this.router.navigate(['grupo/' + String(grupo.id)], { relativeTo: this.route });
  }

  onHorarioDocenteDetailClick(docente: Docente) {
      this.router.navigate(['docente/' + String(docente.id_docente)], { relativeTo: this.route });
  }

  loadGrupos(event?: PaginatorState): void {
    const filtersGrupos = {
      ciclo_escolar__id: [
        {
          value: this.cicloEscolar!.id,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      global_filter: this.grupoGlobalFilter,
    } as GrupoListFilterRequest;

    if (this.grupoEstatusFilter !== null) {
      filtersGrupos.estatus = [
        {
          value: this.grupoEstatusFilter,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    }
    const limit = event?.rows || 10;
    const offset = event?.first || 0;

    this.academicoService
      .GrupoListApi('', '', filtersGrupos, offset, limit)
      .subscribe({
        next: (response) => {
          this.gruposData = response;
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

  loadDocentes(event?: PaginatorState): void {
    const filtersDocentes = {
      global_filter: this.docenteGlobalFilter,
    } as DocenteListFilterRequest;

    if (this.docenteEstatusFilter !== null) {
      filtersDocentes.estatus = [
        {
          value: this.docenteEstatusFilter,
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    }
    const limit = event?.rows || 10;
    const offset = event?.first || 0;
    this.docenteService
      .DocenteListApi('', '', filtersDocentes, offset, limit)
      .subscribe({
        next: (response) => {
          this.docentesData = response;
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
