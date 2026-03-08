import { AsignacionDocente, Grupo, Materia } from './academico.interface';
import { Alumno } from './alumno.interface';
import { FilterField } from './filter.interface';
import { File } from './file-manager.interface';

export interface Docente {
  id_docente: number;
  nombres: string;
  paterno: string;
  materno: string;
  telefono: string;
  celular: string;
  domicilio: string;
  correo: string;
  rfc: string;
  cedula_profesional: string;
  estatus: string;
}

export interface DocenteUpdate {
  nombres?: string;
  paterno?: string;
  materno?: string;
  telefono?: string;
  celular?: string;
  domicilio?: string;
  correo?: string;
  rfc?: string;
  cedula_profesional?: string;
  estatus?: string;
}

export interface DocenteListFilterRequest {
  global_filter: string;
  id_docente: FilterField[];
  nombres: FilterField[];
  paterno: FilterField[];
  materno: FilterField[];
  telefono: FilterField[];
  celular: FilterField[];
  domicilio: FilterField[];
  correo: FilterField[];
  rfc: FilterField[];
  cedula_profesional: FilterField[];
  estatus: FilterField[];
}

export interface DocenteAsignacionDocente extends Omit<
  AsignacionDocente,
  'estatus' | 'estatus_display'
> {}

export interface DocenteGrupo extends Omit<
  Grupo,
  'capacidad_maxima' | 'estatus'
> {
  materias: Partial<Materia>[];
  total_alumnos: number;
}

export interface DocenteHistorialAcademico {
  id: number;
  alumno: Partial<Alumno>;
  calificacion: number;
  estatus_historial: number;
  estatus_historial_display: string;
}

export interface DocenteInscripcionByGrupo {
  id: number;
  alumno: Partial<Alumno>;
}

export interface DocenteAsistencia {
  id: number;
  alumno: Partial<Alumno>;
  fecha: string;
  hora: string;
  tipo: number;
  tipo_display: string;
  observaciones: string;
}

export interface FileDocente extends File {
  id: number;
  tipo: 1 | 2 | 3;
  tipo_display: 'Evidencia' | 'Expediente' | 'Otro';
}

export interface CapacitacionBase {
  id: number;
  nombre: string;
  lugar: string;
  duracion: number;
  tipo: number;
  fecha_inicio: string;
  fecha_fin: string;
  estatus_capacitacion: number;
  estatus: number;
}

export interface Capacitacion extends CapacitacionBase {
  tipo_display: string;
  estatus_capacitacion_display: string;
  estatus_display: string;
}

export interface DocenteCapacitacionCreate extends Omit<
  CapacitacionBase,
  'id' | 'estatus'
> {}

export interface DocenteCapacitacionUpdate extends Partial<
  Omit<CapacitacionBase, 'id' | 'estatus'>
> {}

export interface DocenteCapacitacion extends Omit<
  Capacitacion,
  'estatus'
> {}


export interface FileCapacitacion extends File {
  id: number;
}
