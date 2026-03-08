export interface ConfiguracionBase {
  nombre_institucion: string;
  clave_centro: string;
  organismo: string;
  subsecretaria: string;

  direccion: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  telefono: string;
  correo_institucional: string;

  nombre_director: string;
  genero_director: 'M' | 'F';
}

export interface Configuracion extends ConfiguracionBase {
  id: number;
  genero_director_display: string;
}
