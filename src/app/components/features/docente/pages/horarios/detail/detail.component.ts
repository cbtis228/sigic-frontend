import * as Papa from 'papaparse';
import { Component, OnInit } from '@angular/core';
import {
  Grupo,
  Horario,
  HorarioCreate,
  HorarioUpdate,
} from '../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HorarioSemanalCardComponent } from '../../../../../shared/horario-semanal-card/horario-semanal-card.component';
import { ButtonModule } from 'primeng/button';
import { HorarioCreateDialogComponent } from '../../../components/horario-create-dialog/horario-create-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../services/error.service';
import { forkJoin } from 'rxjs';
import { HorarioEditDialogComponent } from '../../../components/horario-edit-dialog/horario-edit-dialog.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-detail',
  imports: [
    HorarioSemanalCardComponent,
    ButtonModule,
    HorarioCreateDialogComponent,
    RouterModule,
    HorarioEditDialogComponent,
    CommonModule,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  horarios: Horario[] = [];
  grupo: Grupo | null = null;
  selectedHorario: Horario | null = null;
  showHorarioCreateDialog = false;
  showHorarioEditDialog = false;
  dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private errorService: ErrorService,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    forkJoin({
      grupo: this.academicoService.GrupoDetailApi(Number(id)),
      horarios: this.academicoService.HorarioListByGrupoApi(Number(id)),
    }).subscribe({
      next: (response) => {
        this.grupo = response.grupo;
        this.horarios = response.horarios;
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

  loadHorario() {
    this.academicoService.HorarioListByGrupoApi(this.grupo!.id).subscribe({
      next: (response) => (this.horarios = response),
    });
  }

  onEditClick(horario: Horario) {
    this.selectedHorario = horario;
    this.showHorarioEditDialog = true;
  }

  onHorarioEdit(horario: HorarioUpdate) {
    this.academicoService
      .HorarioUpdateApi(this.selectedHorario!.id, horario)
      .subscribe({
        next: () => {
          this.messageService.add({
            detail: 'Horario actualizado correctamente',
            severity: 'success',
          });
          this.showHorarioEditDialog = false;
          this.loadHorario();
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

  onExportarClick() {
    const data = this.horarios.map((h) => ({
      ID: h.id,
      Materia: h.asignacion_docente.materia?.clave || '',
      Docente: h.asignacion_docente.docente?.id_docente,
      Dia: h.dia_semana,
      HoraInicio: h.hora_inicio,
      HoraFin: h.hora_fin,
      Salon: h.salon || 'NA',
      Estatus: h.estatus,
    }));

    const csv = Papa.unparse(data, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horarios_${this.grupo?.nombre_grupo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

imprimirHorario() {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    // Agrupar horarios por día_semana
    const horariosPorDia: { [key: number]: Horario[] } = {};
    this.horarios.forEach((h) => {
      if (!horariosPorDia[h.dia_semana]) horariosPorDia[h.dia_semana] = [];
      horariosPorDia[h.dia_semana].push(h);
    });

    // HTML con estilo para impresión vertical
    let contenido = `<html><head><title>Horario</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        margin: 20px;
        color: #000;
        background-color: #fff;
      }
      @media print {
        body { margin: 0; }
      }
      .horario { 
        width: 100%;
        border-collapse: collapse;
      }
      .dia { 
        vertical-align: top;
        padding: 8px;
        border: 1px solid #000;
        width: 20%;
      }
      .dia h2 { 
        text-align: center; 
        color: #000;
        margin-bottom: 10px;
        font-size: 16px;
        text-decoration: underline;
      }
      .clase { 
        border: 1px solid #000;
        padding: 6px;
        margin-bottom: 4px;
        page-break-inside: avoid;
      }
      .clase-continua {
        border: 1px solid #000;
        padding: 6px;
        margin-bottom: 4px;
        page-break-inside: avoid;
        background-color: #f5f5f5;
      }
      .descanso {
        border: 1px dashed #666;
        padding: 6px;
        margin-bottom: 4px;
        background-color: #f9f9f9;
        font-style: italic;
        text-align: center;
      }
      .hora { 
        font-weight: bold; 
        color: #000;
        font-size: 12px;
      }
      .materia { 
        font-weight: 500; 
        color: #000;
        margin: 2px 0;
        font-size: 12px;
      }
      .info { 
        font-size: 11px; 
        color: #000;
      }
    </style>
    </head><body>`;

    contenido += `<table class="horario"><tr>`;

    dias.forEach((dia, index) => {
      const diaNum = index + 1;
      let clases = horariosPorDia[diaNum] || [];

      // Ordenar clases por hora de inicio
      clases = clases.sort((a, b) =>
        this.compararHoras(a.hora_inicio, b.hora_inicio)
      );

      contenido += `<td class="dia"><h2>${dia}</h2>`;

      if (clases.length) {
        // Procesar clases agrupando las continuas
        let i = 0;
        while (i < clases.length) {
          const claseActual = clases[i];
          
          // Verificar si la siguiente clase es continua
          if (i < clases.length - 1 && this.esClaseContinua(claseActual, clases[i + 1])) {
            // Encontrar todas las clases continuas consecutivas
            const clasesContinuas = [claseActual];
            let j = i;
            
            while (j < clases.length - 1 && this.esClaseContinua(clases[j], clases[j + 1])) {
              clasesContinuas.push(clases[j + 1]);
              j++;
            }
            
            // Generar bloque unificado para clases continuas
            contenido += this.generarHTMLClaseContinua(clasesContinuas);
            i = j + 1; // Saltar todas las clases ya procesadas
          } else {
            // Clase individual
            contenido += this.generarHTMLClase(claseActual);
            i++;
          }

          // Verificar si hay descanso hasta la siguiente clase (incluso de 1 minuto)
          if (i < clases.length) {
            const claseSiguiente = clases[i];
            const horaFinActual = clases[i - 1].hora_fin;
            const horaInicioSiguiente = claseSiguiente.hora_inicio;
            
            // Si hay cualquier diferencia de tiempo, es descanso
            if (horaFinActual !== horaInicioSiguiente) {
              contenido += this.generarHTMLDescanso(horaFinActual, horaInicioSiguiente);
            }
          }
        }
      } else {
        contenido += `<div class="clase">Sin clases</div>`;
      }
      contenido += `</td>`;
    });

    contenido += `</tr></table></body></html>`;

const ventana = window.open('', '_blank', 'width=800,height=600');
    if (ventana) {
      ventana.document.write(contenido);
      ventana.document.close();
      ventana.print();
    }
  }

  // Método auxiliar para comparar horas
  compararHoras(horaA: string, horaB: string): number {
    const [horaA1, minA1, segA1 = 0] = horaA.split(':').map(Number);
    const [horaB1, minB1, segB1 = 0] = horaB.split(':').map(Number);
    
    const totalMinutosA = horaA1 * 60 + minA1 + segA1 / 60;
    const totalMinutosB = horaB1 * 60 + minB1 + segB1 / 60;
    
    return totalMinutosA - totalMinutosB;
  }

  // Método auxiliar para verificar si son clases continuas
  esClaseContinua(claseActual: Horario, claseSiguiente: Horario): boolean {
    // Verificar misma asignación docente y horario continuo
    const mismaAsignacion = claseActual.asignacion_docente.id === claseSiguiente.asignacion_docente.id;
    const horarioContinuo = claseActual.hora_fin === claseSiguiente.hora_inicio;
    
    return mismaAsignacion && horarioContinuo;
  }

  // Método auxiliar para generar HTML de clase individual
  generarHTMLClase(clase: Horario): string {
    const horaInicio = clase.hora_inicio.substring(0, 5); // Quitar segundos
    const horaFin = clase.hora_fin.substring(0, 5); // Quitar segundos

    return `
      <div class="clase">
        <div class="hora">${horaInicio} - ${horaFin}</div>
        <div class="materia">${
          clase.asignacion_docente.materia?.nombre || 'Sin materia'
        }</div>
        <div class="info">
          Aula: ${clase.salon || 'Sin aula'}<br>
          Profesor: ${clase.asignacion_docente.docente?.nombres || ''} ${
      clase.asignacion_docente.docente?.paterno || ''
    }
        </div>
      </div>
    `;
  }

  // Método auxiliar para generar HTML de clases continuas agrupadas
  generarHTMLClaseContinua(clases: Horario[]): string {
    const primeraClase = clases[0];
    const ultimaClase = clases[clases.length - 1];
    
    const horaInicio = primeraClase.hora_inicio.substring(0, 5);
    const horaFin = ultimaClase.hora_fin.substring(0, 5);

    return `
      <div class="clase-continua">
        <div class="hora">${horaInicio} - ${horaFin}</div>
        <div class="materia">${
          primeraClase.asignacion_docente.materia?.nombre || 'Sin materia'
        }</div>
        <div class="info">
          Aula: ${primeraClase.salon || 'Sin aula'}<br>
          Profesor: ${primeraClase.asignacion_docente.docente?.nombres || ''} ${
      primeraClase.asignacion_docente.docente?.paterno || ''
    }<br>
        </div>
      </div>
    `;
  }

  // Método auxiliar para generar HTML de descanso
  generarHTMLDescanso(horaFin: string, horaInicioSiguiente: string): string {
    const horaFinSinSegundos = horaFin.substring(0, 5);
    const horaInicioSiguienteSinSegundos = horaInicioSiguiente.substring(0, 5);

    return `
      <div class="descanso">
        <div class="hora">${horaFinSinSegundos} - ${horaInicioSiguienteSinSegundos}</div>
        <div class="materia">Descanso</div>
      </div>
    `;
  }

  onDeleteHorario(id: Horario['id']) {
    this.academicoService.HorarioUpdateApi(id, { estatus: 2 }).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Horario eliminado correctamente',
          severity: 'success',
        });
        this.showHorarioEditDialog = false;
        this.loadHorario();
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

  onDeleteClick(horario: Horario['id']): void {
    this.confirmationService.confirm({
      header: 'Confirmar eliminacion de hora',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sí, eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.onDeleteHorario(horario);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'La hora no ha sido eliminada',
          life: 3000,
        });
      },
    });
  }

  onHorarioCreate(horario: HorarioCreate) {
    this.academicoService.HorarioCreateApi(horario).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Horario agregado correctamente',
          severity: 'success',
        });
        this.showHorarioCreateDialog = false;
        this.loadHorario();
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
