import { ValidatorMessageInterface } from "./interfaces/validator-message.interface";

export const USER_KEY = 'boilerplate-project-v1'
export const TOKEN_KEY = 'boilerplate-project-v1-token'
export const THEME_KEY = 'boilerplate-project-v1-theme'
export const DARK_THEME_KEY = 'boilerplate-project-v1-dark-theme'
export const THEME_APPEARANCE_KEY='appearance'
export const PERMISSIONS_KEY = 'permissions'

export const ESTADOS_ALUMNO = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 2 },
  { label: 'Egresado', value: 3 }
];

export const ESTADOS_DOCENTE = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 2 },
];

export const TIPO_ASISTENCIA = [
  { label: 'Normal', value: 1 },
  { label: 'Retardo', value: 2 },
  { label: 'Falta', value: 3 },
  { label: 'Justificada', value: 4 },
];

export const TIPO_SALON = [
  { label: 'Aula', value: 1 },
  { label: 'Laboratorio', value: 2 },
  { label: 'Taller', value: 3 },
  { label: 'Otro', value: 4 },
];

export const TIPO_INCIDENCIA = [
  { label: 'Academica', value: 1 },
  { label: 'Disciplinaria', value: 2 },
];

export const GRAVEDAD_INCIDENCIA = [
  { label: 'Leve', value: 1 },
  { label: 'Medio', value: 2 },
  { label: 'Grave', value: 3 },
];

export const ESTADOS_GENERALES = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 2 },
];

export const TIPO_FILE_DOCENTE = [
  { label: 'Evidencia académica', value: 1 },
  { label: 'Expediente', value: 2 },
  { label: 'Otro', value: 3 },
];

export const TIPO_CAPACITACION = [
  { label: 'Presencial', value: 1 },
  { label: 'Virtual', value: 2 },
  { label: 'Hibrida', value: 3 },

]

export const ESTATUS_CAPACITACION = [
  { label: 'En Progreso', value: 1 },
  { label: 'Completado', value: 2 },
  { label: 'Certificado', value: 3 },

]

const MENSAJE_ERROR_PATTERN: ValidatorMessageInterface = { value: 'pattern', message: 'core.form.errors.pattern' };
const MENSAJE_ERROR_REQUIRED: ValidatorMessageInterface = { value: 'required', message: 'core.form.errors.required' };
const MENSAJE_ERROR_EMAIL: ValidatorMessageInterface = { value: 'email', message: 'core.form.errors.email' };
const MENSAJE_ERROR_PASSWORD: ValidatorMessageInterface = { value: 'passwordInvalid', message: 'core.form.errors.password' };
const MENSAJE_ERROR_PASSWORD_CONFIRM: ValidatorMessageInterface = { value: 'passwordConfirm', message: 'core.form.errors.password-confirm' };
const MENSAJE_ERROR_MIN: ValidatorMessageInterface = { value: 'min', message: 'core.form.errors.min' };
const MENSAJE_ERROR_MAX: ValidatorMessageInterface = { value: 'max', message: 'core.form.errors.max' };
const MENSAJE_ERROR_MIN_LENGTH: ValidatorMessageInterface = { value: 'minlength', message: 'core.form.errors.min-length' };
const MENSAJE_ERROR_MAX_LENGTH: ValidatorMessageInterface = { value: 'maxlength', message: 'core.form.errors.max-length' };

export const MENSAJES_ERROR: ValidatorMessageInterface[] = [
  MENSAJE_ERROR_PATTERN,
  MENSAJE_ERROR_REQUIRED,
  MENSAJE_ERROR_EMAIL,
  MENSAJE_ERROR_PASSWORD,
  MENSAJE_ERROR_PASSWORD_CONFIRM,
  MENSAJE_ERROR_MIN,
  MENSAJE_ERROR_MAX,
  MENSAJE_ERROR_MIN_LENGTH,
  MENSAJE_ERROR_MAX_LENGTH
]

export const CONST_ALERTA_ARCHIVO = 'No se pudo obtener el archivo'

export const CONST_ALERTA_ERROR = {
  severity: 'error',
  summary: 'Error',
  life: 3000
};

export const CONST_ALERTA_CORRECTO = {
  severity: 'success',
  summary: 'Correcto',
  life: 3000
};

export const CONST_ALERTA_INFORMACION = {
  severity: 'info',
  summary: 'Información',
  life: 3000
};

export const LARGO_PASSWORD = 8;

export const BASE_HEADERS = {
  'Content-Type': 'application/json',
  //'Access-Control-Allow-Origin': '*',
  //'skipAuth': 'false',
  //'showSuccesfulResponse': 'false',
  //'showLoading': 'false'
}

const CONFIG_LOGO = 'logo';
const STORED_LOGO = 'string-logo';
const STORED_ORGANIZATION_DATA = 'string-organization-data';
const CONFIG_BANNER = 'banner';
const CONFIG_ORGANIZACION = 'organizacion';
const CONFIG_RFC = 'rfc';
const CONFIG_DIRECCION = 'direccion';
const CONFIG_RAZON_SOCIAL = 'razon_social';
const CONFIG_TELEFONO = 'telefono';
const CONFIG_EMAIL = 'email';

export const CONST_CONFIG = {
  CONFIG_LOGO,
  STORED_LOGO,
  STORED_ORGANIZATION_DATA,
  CONFIG_BANNER,
  CONFIG_ORGANIZACION,
  CONFIG_RFC,
  CONFIG_DIRECCION,
  CONFIG_RAZON_SOCIAL,
  CONFIG_TELEFONO,
  CONFIG_EMAIL
}

export type CONST_CONFIG = 'logo' | 'banner' | 'organizacion' | 'rfc' | 'direccion' | 'razon_social' | 'telefono' | 'email';
