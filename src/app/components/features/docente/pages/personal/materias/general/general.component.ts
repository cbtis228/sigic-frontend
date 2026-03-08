import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../../../../../services/docente.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../../../../../services/error.service';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import {
  DocenteAsignacionDocente,
  DocenteAsistencia,
  DocenteGrupo,
  DocenteHistorialAcademico,
  DocenteInscripcionByGrupo,
} from '../../../../../../../interfaces/docente.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Horario } from '../../../../../../../interfaces/academico.interface';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Alumno } from '../../../../../../../interfaces/alumno.interface';
import { TIPO_ASISTENCIA } from '../../../../../../../global.constants';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-general',
  imports: [
    CommonModule,
    DatePicker,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    InputNumber,
    TextareaModule,
  ],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  inscripciones: DocenteInscripcionByGrupo[] = [];
  grupos: DocenteGrupo[] | null = null;
  fechaSeleccionada = new Date();
  grupoSeleccionado: DocenteGrupo['id'] | null = null;

  asignacionSeleccionada = 0;
  vista: 'asistencia' | 'calificaciones' = 'asistencia';

  asistencia: Record<number, 'asistio' | 'falta' | null> = {};
  historiales: DocenteHistorialAcademico[] = [];
  asistencias: DocenteAsistencia[] = [];
  searchTerm: string = '';
  horarios: (Horario & { label?: string; dia_semana_display: string })[] = [];
  horarioSeleccionado: number | null = null;
  disabledDays: number[] = [];
  maxDate: Date | null = null;
  minDate: Date | null = null;
  objAsignacion: DocenteAsignacionDocente | null = null;

  asignacion = 0;

  asistenciasObjects: {
    id: number | null;
    alumno: Partial<Alumno>;
    hora: Date | null;
    tipo: number | null;
    observaciones: string | null;
  }[] = [];

  tipoAsistencia = TIPO_ASISTENCIA;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.asignacion = id;
    forkJoin({
      responseAsignacion: this.docenteService.AsignacionDocenteSelfDetail(id),
      responseGrupo: this.docenteService.GrupoSelfListByAsignacionDocente(id),
    }).subscribe({
      next: (response) => {
        this.grupos = response.responseGrupo;
        this.objAsignacion = response.responseAsignacion;

        if (!this.grupos || this.grupos.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin grupos asignados',
            detail: 'No tienes grupos asignados para esta materia.',
          });
          return;
        }
        this.grupoSeleccionado = this.grupos[0].id;

        this.onGrupoChange();
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({ severity: 'error', detail });
      },
    });
  }

  private mergeAsistencias(asistenciasBackend: any[]) {
    this.asistenciasObjects = this.inscripciones.map((inscripcion) => {
      const existeAsistencia = asistenciasBackend.find(
        (a) => a.alumno.numero_control === inscripcion.alumno.numero_control,
      );

      const hora = existeAsistencia?.hora
        ? new Date(`1970-01-01T${existeAsistencia.hora}`)
        : null;

      return {
        id: existeAsistencia?.id || null,
        alumno: inscripcion.alumno,
        tipo: existeAsistencia?.tipo || null,
        hora: hora,
        observaciones: existeAsistencia?.observaciones || null,
      };
    });
  }

  loadDisabledDays() {
    const horarioSeleccionado = this.horarios.find(
      (h) => h.id === this.horarioSeleccionado,
    );

    const diaDelHorario = horarioSeleccionado?.dia_semana;

    if (!diaDelHorario) {
      this.disabledDays = [0, 1, 2, 3, 4, 5, 6];
    }

    const disabledDays = [0, 1, 2, 3, 4, 5, 6].filter(
      (day) => day !== diaDelHorario,
    );

    this.disabledDays = disabledDays;
  }

  onHorarioChange() {
    if (!this.horarioSeleccionado) return;

    const formattedDate = `${this.fechaSeleccionada!.getFullYear()}-${String(
      this.fechaSeleccionada!.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )}-${String(this.fechaSeleccionada!.getDate()).padStart(2, '0')}`;

    this.docenteService
      .AsistenciaSelfListByHorarioAndFecha(
        this.horarioSeleccionado!,
        formattedDate,
      )
      .subscribe({
        next: (response) => {
          this.asistencias = response;
          this.loadDisabledDays();
          this.loadMinTime();
          this.loadMaxTime();
          this.mergeAsistencias(this.asistencias);
        },
      });
  }

  getClosestSchedule(schedules: any[]): any {
    if (!schedules || schedules.length === 0) {
      return null;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let closestSchedule = null;
    let smallestDifference = Infinity;

    for (const schedule of schedules) {
      const scheduleDay = schedule.dia_semana;

      let dayDifference = scheduleDay - currentDay;
      if (dayDifference < 0) {
        dayDifference += 7;
      }

      const [startHours, startMinutes] = schedule.hora_inicio
        .split(':')
        .map(Number);
      const scheduleStartTime = startHours * 60 + startMinutes;

      let totalDifference =
        dayDifference * 24 * 60 + (scheduleStartTime - currentTime);

      if (dayDifference === 0 && scheduleStartTime < currentTime) {
        totalDifference += 7 * 24 * 60;
      }

      if (totalDifference < smallestDifference && totalDifference >= 0) {
        smallestDifference = totalDifference;
        closestSchedule = schedule;
      }
    }
    return closestSchedule;
  }

  onGrupoChange() {
    if (!this.grupoSeleccionado) return;
    forkJoin({
      historialResponse:
        this.docenteService.HistorialAcademicoSelfListByMateriaAndGrupo(
          this.objAsignacion?.materia.id!,
          this.grupoSeleccionado,
        ),
      horarioResponse:
        this.docenteService.HorarioSelfListByGrupoAndAsignacionDocente(
          this.grupoSeleccionado,
          this.asignacion,
        ),
      responseInscripciones: this.docenteService.InscripcionSelfListByGrupo(
        this.grupoSeleccionado,
      ),
    }).subscribe({
      next: (response) => {
        this.horarios = response.horarioResponse;
        if (this.horarios.length == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin horarios asignados',
            detail: 'No tienes horarios asignados para esta materia.',
          });
          return;
        }
        this.inscripciones = response.responseInscripciones;
        this.historiales = response.historialResponse;
        this.horarios = response.horarioResponse;
        this.horarios.forEach((h) => {
          h.label = `${h.dia_semana_display} - ${h.hora_inicio} a ${h.hora_fin}`;
        });
        const closestSchedule = this.getClosestSchedule(this.horarios);
        this.horarioSeleccionado = closestSchedule
          ? closestSchedule.id
          : this.horarios[0].id;
        const nextDate = this.getNextDateForDay(closestSchedule!.dia_semana);
        this.fechaSeleccionada = nextDate;
        this.onHorarioChange();
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({ detail, severity: 'error' });
      },
    });
  }

  getNextDateForDay(targetDay: number): Date {
    const today = new Date();
    const todayDay = today.getDay();

    let diff = targetDay - todayDay;

    if (diff < 0) {
      diff += 7;
    }

    const result = new Date(today);
    result.setDate(today.getDate() + diff);

    return result;
  }

  loadMinTime() {
    const horario = this.horarios.find(
      (h) => h.id === this.horarioSeleccionado,
    );
    if (!horario) {
      this.minDate = null;
      return;
    }

    const now = new Date();
    const [hours, minutes, seconds] = horario.hora_inicio
      .split(':')
      .map(Number);

    const minTime = new Date(now);
    minTime.setHours(hours, minutes, seconds, 0);

    this.minDate = minTime;
  }

  loadMaxTime() {
    const horario = this.horarios.find(
      (h) => h.id === this.horarioSeleccionado,
    );
    if (!horario) {
      this.maxDate = null;
      return;
    }

    const now = new Date();
    const [hours, minutes, seconds] = horario.hora_fin.split(':').map(Number);

    const maxTime = new Date(now);
    maxTime.setHours(hours, minutes, seconds, 0);

    this.maxDate = maxTime;
  }

  filteredHistoriales(): DocenteHistorialAcademico[] {
    if (!this.searchTerm) return this.historiales;

    const term = this.searchTerm.toLowerCase();

    return this.historiales.filter(
      (h) =>
        h.alumno.numero_control?.toLowerCase().includes(term) ||
        h.alumno.nombres?.toLowerCase().includes(term) ||
        h.alumno.paterno?.toLowerCase().includes(term) ||
        h.alumno.materno?.toLowerCase().includes(term),
    );
  }

  marcarAsistencia(id: number, estado: 'asistio' | 'falta') {
    this.asistencia[id] = estado;
  }

  get canRegistrarAsistencias(): boolean {
    if (!this.asistenciasObjects || this.asistenciasObjects.length === 0)
      return false;

    return this.asistenciasObjects.every(
      (a) => a.alumno != null && a.tipo != null && a.hora != null,
    );
  }

  onRegistrarAsistencia() {
    const asistenciasReqObj = this.asistenciasObjects.map((a) => {
      const obj: any = {
        alumno: a.alumno.numero_control!,
        tipo: a.tipo,
        fecha: this.formatDateToYYYYMMDD(this.fechaSeleccionada!),
        horario: this.horarioSeleccionado,
        observaciones: a.observaciones || '',
      };

      if (a.id !== null) {
        obj.id = a.id;
      }

      if (a.hora) {
        const hora = new Date(a.hora);
        const hh = hora.getHours().toString().padStart(2, '0');
        const mm = hora.getMinutes().toString().padStart(2, '0');
        obj.hora = `${hh}:${mm}`;
      }

      return obj;
    });

    this.docenteService
      .AsistenciaSelfRegistrar(this.horarioSeleccionado!, asistenciasReqObj)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Asistencias registradas',
          });
          this.onGrupoChange();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({ severity: 'error', detail });
        },
      });
  }

  onCalificacionSave(historial: DocenteHistorialAcademico) {
    this.docenteService
      .HistorialAcademicoSelfCalificar(historial.id, historial.calificacion)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Calificacion registrada',
          });
          this.onGrupoChange();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({ severity: 'error', detail });
        },
      });
  }

  private formatDateToYYYYMMDD(date: Date): string {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
