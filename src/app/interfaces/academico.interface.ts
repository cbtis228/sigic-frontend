import { Alumno, AlumnoBase } from './alumno.interface';
import { Docente } from './docente.interface';
import { File } from './file-manager.interface';
import { FilterField } from './filter.interface';

export interface CicloEscolar {
  id: number;
  nombre_ciclo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estatus: number;
}

export interface CicloEscolarUpdate {
  id: number;
  nombre_ciclo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estatus: number;
}

export interface CicloEscolarListFilterRequest {
  global_filter: string;
  nombre_ciclo: FilterField[];
  fecha_inicio: FilterField[];
  fecha_fin: FilterField[];
  estatus: FilterField[];
}

export interface Grupo {
  id: number;
  ciclo_escolar: Partial<CicloEscolar>;
  docente: Docente;
  nombre_grupo: string;
  nivel: string;
  turno: string;
  capacidad_maxima: number;
  anio_escolar: number;
  estatus: number;
}

export interface GrupoUpdate {
  ciclo_escolar?: CicloEscolar['id'];
  docente?: Docente['id_docente'];
  nombre_grupo?: string;
  nivel?: string;
  turno?: string;
  capacidad_maxima?: number;
  anio_escolar?: number;
  estatus?: number;
}

export interface GrupoListFilterRequest {
  global_filter: string;
  id: FilterField[];
  ciclo_escolar: FilterField[];
  ciclo_escolar__id: FilterField[];
  docente: FilterField[];
  nombre_grupo: FilterField[];
  nivel: FilterField[];
  turno: FilterField[];
  capacidad_maxima: FilterField[];
  anio_escolar: FilterField[];
  estatus: FilterField[];
}
export interface Inscripcion {
  id: number;
  alumno: Alumno;
  grupo: Partial<Grupo>;
  fecha_inscripcion: string;
  estatus: number;
  observaciones: string;
}

export interface InscripcionUpdate {
  alumno?: Alumno['numero_control'];
  grupo?: Grupo['id'];
  fecha_inscripcion?: string;
  observaciones?: string;
  estatus?: number;
}

export interface InscripcionCreate {
  alumno: Alumno['numero_control'];
  grupo: Grupo['id'];
  fecha_inscripcion?: string;
  observaciones?: string;
}

export interface InscripcionBulkCreate {
  inscripciones_data: InscripcionCreate[];
}

export interface InscripcionBulkCreateResponse {
  inscripciones_exitosas: number[];
  inscripciones_fallidas: {
    detail: string;
    data: {
      alumno: string;
      grupo: number;
    };
  }[];
}

export interface InscripcionListFilterRequest {
  global_filter: string;
  id: FilterField[];
  alumno: FilterField[];
  grupo: FilterField[];
  grupo__ciclo_escolar__id: FilterField[];
  fecha_inscripcion: FilterField[];
  estatus: FilterField[];
  observaciones: FilterField[];
}

export interface Materia {
  id: number;
  nombre: string;
  clave: string;
  creditos?: number;
  horas_teorica?: number;
  horas_practica?: number;
  seriacion: string;
  estatus: number;
}

export interface MateriaUpdate {
  nombre?: string;
  clave?: string;
  creditos?: number;
  horas_teorica?: number;
  horas_practica?: number;
  seriacion?: string;
  estatus?: number;
}

export interface MateriaCreate {
  nombre: string;
  clave: string;
  creditos?: number;
  horas_teorica?: number;
  horas_practica?: number;
  seriacion?: string;
}

export interface MateriaListFilterRequest {
  global_filter: string;
  nombre: FilterField[];
  clave: FilterField[];
  creditos: FilterField[];
  horas_teorica: FilterField[];
  horas_practica: FilterField[];
  seriacion: FilterField[];
  estatus: FilterField[];
}

export interface PlanEstudio {
  id: number;
  nombre: string;
  materias: Partial<Materia[]>;
  nivel: string;
  vigencia_inicio: string;
  vigencia_fin: string;
  estatus: number;
}

export interface PlanEstudioUpdate {
  nombre?: string;
  materias?: Materia['id'][];
  nivel?: string;
  vigencia_inicio?: string;
  vigencia_fin?: string;
  estatus?: number;
}

export interface PlanEstudioCreate {
  nombre: string;
  materias: Materia['id'][];
  nivel: string;
  vigencia_inicio: string;
  vigencia_fin: string;
}

export interface PlanEstudioListFilterRequest {
  global_filter: string;
  nombre: string;
  materias: FilterField[];
  nivel: FilterField[];
  vigencia_inicio: FilterField[];
  vigencia_fin: FilterField[];
  estatus: FilterField[];
}

export interface Horario {
  id: number;
  asignacion_docente: Partial<AsignacionDocente>;
  grupo: Partial<Grupo>;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  salon?: SalonBase;
  estatus: number;
}

export interface HorarioCreate {
  asignacion_docente: AsignacionDocente['id'];
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  salon?: SalonBase;
}

export interface HorarioUpdate {
  asignacion_docente?: AsignacionDocente['id'];
  dia_semana?: number;
  hora_inicio?: string;
  hora_fin?: string;
  salon?: SalonBase;
  estatus?: number;
}

export interface HistorialAcademico {
  id: number;
  inscripcion: Partial<Inscripcion>;
  materia: Partial<Materia>;
  calificacion: number;
  fecha_registro: string;
  periodo: string;
  estatus_historial: number;
  tipo: number;
  estatus: number;
}

export interface HistorialAcademicoByAlumno {
  id: number;
  materia: {
    nombre: string;
    clave: string;
  };
  inscripcion: {
    alumno: {
      numero_control: string;
      nombres: string;
      paterno: string;
      materno: string;
    };
    grupo: {
      nombre_grupo: string;
      ciclo_escolar: {
        nombre_ciclo: string;
      };
    };
  };
  calificacion: number;
  fecha_registro: string;
  periodo: string;
  estatus_historial: number;
  estatus_historial_display?: string;
  tipo: number;
  estatus: number;
}

export interface HistorialAcademicoListFilterRequest {
  global_filter: string;
  alumno: FilterField[];
  materia: FilterField[];
  grupo: FilterField[];
  calificacion: FilterField[];
  fecha_registro: FilterField[];
  periodo: FilterField[];
  estatus_historial: FilterField[];
  tipo: FilterField[];
  estatus: FilterField[];
}

export interface HistorialAcademicoUpdate {
  calificacion?: number;
}

export interface IncidenciaBase {
  tipo: number;
  fecha: string;
  descripcion: string;
  gravedad: number;
  medidas_tomadas: string;
  seguimiento: string;
  estatus?: number;
}

export interface Incidencia extends IncidenciaBase {
  id: number;
  inscripcion: Partial<Inscripcion>;
  tipo_display: string;
  gravedad_display: string;
  estatus: number;
  estatus_display: string;
}

export interface IncidenciaCreate extends Omit<IncidenciaBase, 'estatus'> {
  inscripcion: Inscripcion['id'];
}

export type IncidenciaUpdate = Partial<
  IncidenciaCreate & {
    estatus: number;
  }
>;

export interface IncidenciaListFilterRequest {
  global_filter: string;
  inscripcion?: FilterField[];
  inscripcion__alumno__numero_control?: FilterField[];
  inscripcion__grupo__id?: FilterField[];
  tipo?: FilterField[];
  fecha?: FilterField[];
  descripcion?: FilterField[];
  gravedad?: FilterField[];
  medidas_tomadas?: FilterField[];
  seguimiento?: FilterField[];
  estatus?: FilterField[];
}

export interface ServicioSocialBase {
  actividad: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  horas_acumuladas: number;
  responsable: string;
  estatus?: number;
  completado: boolean;
  evidencia?: string;
}

export interface ServicioSocial extends ServicioSocialBase {
  id: number;
  alumno: Partial<Alumno>; // información parcial del alumno
  estatus_display: string;
}

export interface ServicioSocialCreate
  extends Omit<ServicioSocialBase, 'estatus'> {
  alumno: Alumno['numero_control']; // se envía solo el ID del alumno
}

export type ServicioSocialUpdate = Partial<
  ServicioSocialCreate & {
    estatus: number;
  }
>;

export interface ServicioSocialListFilterRequest {
  global_filter?: string;
  alumno__numero_control?: FilterField[];
  actividad?: FilterField[];
  fecha_inicio?: FilterField[];
  fecha_fin?: FilterField[];
  horas_acumuladas?: FilterField[];
  responsable?: FilterField[];
  estatus?: FilterField[];
  completado?: FilterField[];
  evidencia?: FilterField[];
}

export interface FileServicioSocial extends File {
  id: number;
}

export interface RegistroHorasServicioSocialBase {
  horas: number;
  descripcion: string;
  fecha_registro: string;
}

export interface RegistroHorasServicioSocial
  extends RegistroHorasServicioSocialBase {
  id: number;
}

export interface AsignacionDocenteBase {
  id: number;
  estatus?: number;
}

export interface AsignacionDocente extends AsignacionDocenteBase {
  docente: Partial<Docente>;
  materia: Partial<Materia>;
  ciclo_escolar: Partial<CicloEscolar>;
  estatus_display: string;
}

export interface AsignacionDocenteUpdate
  extends Omit<AsignacionDocenteBase, 'id'> {
  docente?: Docente['id_docente'];
  ciclo_escolar?: CicloEscolar['id'];
  materia?: Materia['id'];
}

export interface AsignacionDocenteCreate
  extends Omit<AsignacionDocenteBase, 'id' | 'estatus'> {
  docente: Docente['id_docente'];
  ciclo_escolar: CicloEscolar['id'];
  materia: Materia['id'];
}

export interface AsignacionDocenteListFilterRequest {
  global_filter?: string;
  docente__id_docente?: FilterField[];
  materia__id?: FilterField[];
  id?: FilterField[];
  ciclo_escolar__id?: FilterField[];
  estatus?: FilterField[];
}

export interface DocenteGrupoDetail
  extends Omit<Grupo, 'estatus' | 'docente'> {}

export interface AsistenciaBase {
  id: number;
  fecha: string;
  hora: string;
  tipo: string;
  tipo_display: string;
  estatus?: number;
  observaciones?: string;
}

export interface Asistencia extends AsistenciaBase {
  horario: Partial<Horario>;
  alumno: Partial<Alumno>;
  estatus_display: string;
}

export interface AsistenciaListFilterRequest {
  global_filter?: string;
  alumno__numero_control?: FilterField[];
  horario__id?: FilterField[];
  fecha?: FilterField[];
  hora?: FilterField[];
  tipo?: FilterField[];
}

export interface SalonBase {
  id: number;
  nombre: string;
  ubicacion?: string;
  capacidad?: string;
  tipo: number;
  estatus: number;
}

export interface Salon extends SalonBase {
  tipo_display: string;
  estatus_display: string;
}
export interface SalonCreate extends Omit<SalonBase, 'id' | 'estatus'> {}

export interface SalonUpdate extends Partial<Omit<SalonBase, 'id'>> {}

export interface SalonListFilterRequest {
  global_filter?: string;
  nombre?: FilterField[];
  ubicacion?: FilterField[];
  capacidad?: FilterField[];
  tipo?: FilterField[];
  estatus?: FilterField[];
}

export interface AlumnoInRisk extends AlumnoBase {
  historial_academico: HistorialAcademico[];
  inscripcion: Partial<Inscripcion>;
  razon: string;
}

export interface AlumnoInRiskListFilterRequest {
  global_filter?: string;
  alumno__numero_control?: FilterField[];
  grupo__id?: FilterField[];
}
