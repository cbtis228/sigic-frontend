import {
  Grupo,
  HistorialAcademico,
  Horario,
  ServicioSocial,
} from './academico.interface';
import { FilterField } from './filter.interface';

export interface AlumnoBase{
  numero_control: string;
  nombres: string;
  paterno: string;
  materno: string;
}

export interface Alumno extends AlumnoBase {
  correo: string;
  telefono: string;
  domicilio: string;
  fecha_ingreso: string;
  estatus: number;
  discapacidades: string;
  enfermedades: string;
}

export interface ContactoEmergencia {
  id: number;
  alumno: Alumno['numero_control'];
  nombre_completo: string;
  parentesco: string;
  celular: string;
  telefono: string;
  telefono_trabajo: string;
  correo_electronico: string;
}

export interface ContactoEmergenciaUpdate {
  id: number;
  nombre_completo?: string;
  parentesco?: string;
  celular?: string;
  telefono?: string;
  telefono_trabajo?: string;
  correo_electronico?: string;
}

export interface DatosFacturacion {
  id: number;
  alumno: Alumno['numero_control'];
  rfc: string;
  razon_social: string;
  codigo_postal: string;
  regimen_fiscal: string;
  uso_factura: string;
  domicilio_fiscal: string;
}

export interface DatosFacturacionUpdate {
  rfc?: string;
  razon_social?: string;
  codigo_postal?: string;
  regimen_fiscal?: string;
  uso_factura?: string;
  domicilio_fiscal?: string;
}

export interface AlumnoCreate {
  user: number;
  numero_control: string;
  nombres: string;
  paterno: string;
  materno: string;
  correo: string;
  telefono: string | null;
  domicilio: string | null;
  fecha_ingreso: string | null;
  estatus: number | null;
  discapacidades: string | null;
  enfermedades: string | null;
}

export interface AlumnoUpdate {
  nombres?: string;
  paterno?: string;
  materno?: string;
  telefono?: string | null;
  domicilio?: string | null;
  fecha_ingreso?: string | null;
  estatus?: number | null;
  discapacidades?: string | null;
  enfermedades?: string | null;
}

export interface AlumnoListFilterRequest {
  global_filter: string;
  numero_control: FilterField[];
  nombres: FilterField[];
  paterno: FilterField[];
  materno: FilterField[];
  correo: FilterField[];
  telefono: FilterField[];
  domicilio: FilterField[];
  fecha_ingreso: FilterField[];
  estatus: FilterField[];
}

export interface AlumnoHorario extends Omit<Horario, 'id' | 'estatus'> {}

export interface AlumnoHistorialAcademico
  extends Omit<HistorialAcademico, 'inscripcion' | 'estatus'> {
  estatus_historial_display: string;
  tipo_display: string;
}

export interface AlumnoInscripcion {
  id: number;
  grupo: Partial<Grupo>;
  fecha_inscripcion: string;
}

export interface AlumnoServicioSocial
  extends Omit<
    ServicioSocial,
    'id' | 'estatus' | 'estatus_display' | 'alumno'
  > {}
