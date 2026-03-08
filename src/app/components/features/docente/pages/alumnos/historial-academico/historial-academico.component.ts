import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import * as Papa from 'papaparse';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { HistorialAcademicoByAlumno, HistorialAcademicoUpdate } from '../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../services/academico.service';
import { ErrorService } from '../../../../../../services/error.service';
import { HistorialAcademicoEditDialogComponent } from '../../../components/historial-academico-edit-dialog/historial-academico-edit-dialog.component';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-detail',
  templateUrl: './historial-academico.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    HistorialAcademicoEditDialogComponent,
    TableModule,
  ],
  styleUrls: ['./historial-academico.component.scss'],
})
export class HistorialAcademicoComponent implements OnInit {
  historialesAcademicos: HistorialAcademicoByAlumno[] = [];
  filteredHistoriales: HistorialAcademicoByAlumno[] = [];
  showEditDialog = false

  searchMateria: string = '';
  filterEstatus: number | null = null;
  filterTipo: number | null = null;

  estatusOptions = [
    { label: 'Aprobado', value: 1 },
    { label: 'Reprobado', value: 2 },
    { label: 'Cursando', value: 3 },
  ];

  tipoOptions = [
    { label: 'Regular', value: 1 },
    { label: 'Extraordinario', value: 2 },
  ];

  selectedHistorial: HistorialAcademicoByAlumno | null = null

  constructor(
    private route: ActivatedRoute,
    private academicoService: AcademicoService,
    private errorService: ErrorService,
    private messageService: MessageService,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    const numero_control = this.route.parent?.snapshot.paramMap.get('id');

    if (!numero_control) return;

    this.academicoService
      .HistorialAcademicoByAlumnoApi(numero_control)
      .subscribe({
        next: (response) => {
          this.historialesAcademicos = response;
          this.filteredHistoriales = [...response];
        },
        error: (error) => {
          const errorMessage = this.errorService.formatError(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          });
        },
      });
  }

  applyFilters() {
    this.filteredHistoriales = this.historialesAcademicos.filter((h) => {
      const matchesMateria = this.searchMateria
        ? h.materia.nombre
            .toLowerCase()
            .includes(this.searchMateria.toLowerCase())
        : true;
      const matchesEstatus = this.filterEstatus
        ? h.estatus_historial === this.filterEstatus
        : true;
      const matchesTipo = this.filterTipo ? h.tipo === this.filterTipo : true;
      return matchesMateria && matchesEstatus && matchesTipo;
    });
  }

  clearFilters() {
    this.searchMateria = '';
    this.filterEstatus = null;
    this.filterTipo = null;
    this.applyFilters();
  }

  exportCSV() {
    const data = this.filteredHistoriales.map((h) => ({
      Materia: h.materia.nombre,
      Periodo: h.periodo,
      Calificacion: h.calificacion ?? 'No calificado',
      Tipo: h.tipo === 1 ? 'Regular' : 'Extraordinario',
      Estatus:
        h.estatus_historial === 2
          ? 'Aprobado'
          : h.estatus_historial === 3
            ? 'Reprobado'
            : 'Cursando',
    }));

    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Historiales.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  printPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        ['Materia', 'Periodo', 'Calificación', 'Tipo', 'Estatus', 'Docente'],
      ],
      body: this.filteredHistoriales.map((h) => [
        h.materia.nombre,
        h.periodo,
        h.calificacion ?? 'No calificado',
        h.tipo === 1 ? 'Regular' : 'Extraordinario',
        h.estatus_historial === 2
          ? 'Aprobado'
          : h.estatus_historial === 3
            ? 'Reprobado'
            : 'Cursando',
      ]),
    });
    doc.save('Historiales.pdf');
  }

  onEditHistorial(historial: HistorialAcademicoUpdate) {
    this.academicoService.HistorialacademicoUpdateApi(this.selectedHistorial!.id, historial).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Historial actualizado correctamente',
        });
        this.showEditDialog = false;
        this.ngOnInit();
      },
      error: (error) => {
        const errorMessage = this.errorService.formatError(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  }
}
