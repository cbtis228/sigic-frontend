import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { GrupoSummaryCardComponent } from '../grupo-summary-card/grupo-summary-card.component';
import { CicloEscolar, Grupo } from '../../../../../interfaces/academico.interface';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';

@Component({
  selector: 'app-grupo-horario-list',
  imports: [
    CommonModule,
    PaginatorModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    GrupoSummaryCardComponent,
  ],
  templateUrl: './grupo-horario-list.component.html',
  styleUrl: './grupo-horario-list.component.scss',
})
export class GrupoHorarioListComponent {
  estatuses = ESTADOS_GENERALES;
  @Input() cicloEscolar: CicloEscolar | null = null;
  @Input() gruposData: PaginatedData<Grupo> | null = null;
  @Input() ciclosEscolares: CicloEscolar[] = [];
  @Output() onHorarioDetailClick: EventEmitter<Grupo> = new EventEmitter<Grupo>();
  @Output() loadTable: EventEmitter<PaginatorState | undefined> = new EventEmitter<PaginatorState | undefined>();
  @Input() globalFilter: string = '';
  @Output() globalFilterChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() estatusFilter: number | null = null;
  @Output() estatusFilterChange: EventEmitter<number | null> = new EventEmitter<number | null>();
}
