import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { CicloEscolar } from '../../../../../interfaces/academico.interface';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { Docente } from '../../../../../interfaces/docente.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { GrupoSummaryCardComponent } from '../grupo-summary-card/grupo-summary-card.component';
import { DocenteSummaryCardComponent } from "../docente-summary-card/docente-summary-card.component";

@Component({
  selector: 'app-docente-horario-list',
  imports: [
    CommonModule,
    PaginatorModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    DocenteSummaryCardComponent
],
  templateUrl: './docente-horario-list.component.html',
  styleUrl: './docente-horario-list.component.scss'
})
export class DocenteHorarioListComponent {
  estatuses = ESTADOS_GENERALES;
  @Input() cicloEscolar: CicloEscolar | null = null;
  @Input() docentesData: PaginatedData<Docente> | null = null;
  @Input() ciclosEscolares: CicloEscolar[] = [];
  @Output() onHorarioDetailClick: EventEmitter<Docente> = new EventEmitter<Docente>();
  @Output() loadTable: EventEmitter<PaginatorState | undefined> = new EventEmitter<PaginatorState | undefined>();
  @Input() globalFilter: string = '';
  @Output() globalFilterChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() estatusFilter: number | null = null;
  @Output() estatusFilterChange: EventEmitter<number | null> = new EventEmitter<number | null>();
}
