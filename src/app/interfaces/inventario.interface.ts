import { Docente } from "./docente.interface";
import { FilterField } from "./filter.interface";

export interface Ubicacion {
  id_ubicacion?: number;
  descripcion: string;
  estatus?: number;
}

export interface UbicacionUpdate {
  id_ubicacion?: number;
  descripcion?: string;
  estatus?: number;
}

export interface UbicacionFilterRequest {
  global_filter: string;
  descripcion: FilterField[];
  estatus: FilterField[];
}

export interface Bien {
  id_bien: number;
  nombre: string;
  marca: string;
  modelo: string;
  es_serializado: boolean;
  estatus: number;
}

export interface InventarioFisico {
  id_inventario_fisico: number;
  catalogo: Bien;
  cantidad: number;
  codigo_interno: string;
  numero_serie: string;
  ubicacion_actual: Ubicacion;
  responsable_actual: Docente;
  estatus: number;
}

export interface MovimientoInventario {
  id_movimiento: number;
  bien: Bien;
  tipo_movimiento: number;
  cantidad: number;
  origen: Ubicacion;
  responsable_origen: Docente;
  destino: Ubicacion;
  responsable_destino: Docente;
  fecha_hora: Date;
  observaciones: string;
}
