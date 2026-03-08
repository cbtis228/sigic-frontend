import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ESTADOS_ALUMNO } from '../../../../../global.constants';
import { CicloEscolar } from '../../../../../interfaces/academico.interface';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { Alumno } from '../../../../../interfaces/alumno.interface';
import { PaginatorState } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-alumno-historial-academico-list',
  imports: [FormsModule, CommonModule, SelectModule],
  templateUrl: './alumno-historial-academico-list.component.html',
  styleUrl: './alumno-historial-academico-list.component.scss',
})
export class AlumnoHistorialAcademicoListComponent {
  estatuses = ESTADOS_ALUMNO;
  @Input() cicloEscolar: CicloEscolar | null = null;
  @Input() alumnosData: PaginatedData<Alumno> | null = null;
  @Input() ciclosEscolares: CicloEscolar[] = [];
  @Output() onHistorialAcademicoClick: EventEmitter<Alumno> =
    new EventEmitter<Alumno>();
  @Output() loadTable: EventEmitter<PaginatorState | undefined> =
    new EventEmitter<PaginatorState | undefined>();
  @Input() globalFilter: string = '';
  @Output() globalFilterChange: EventEmitter<string> =
    new EventEmitter<string>();
  @Input() estatusFilter: number | null = null;
  @Output() estatusFilterChange: EventEmitter<number | null> = new EventEmitter<
    number | null
  >();
}
