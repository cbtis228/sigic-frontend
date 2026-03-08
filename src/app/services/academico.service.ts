import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { BASE_HEADERS } from '../global.constants';
import { BYPASS_INTERCEPTOR_TOKEN } from '../interceptors/token-interceptor';
import { BYPASS_INTERCEPTOR_LOADING } from '../interceptors/loading-interceptor';
import { PaginatedData } from '../interfaces/paginated-data.interface';
import {
  AlumnoInRisk,
  AlumnoInRiskListFilterRequest,
  AsignacionDocente,
  AsignacionDocenteCreate,
  AsignacionDocenteListFilterRequest,
  AsignacionDocenteUpdate,
  Asistencia,
  AsistenciaListFilterRequest,
  CicloEscolar,
  CicloEscolarListFilterRequest,
  CicloEscolarUpdate,
  FileServicioSocial,
  Grupo,
  GrupoListFilterRequest,
  GrupoUpdate,
  HistorialAcademico,
  HistorialAcademicoByAlumno,
  HistorialAcademicoListFilterRequest,
  HistorialAcademicoUpdate,
  Horario,
  HorarioCreate,
  HorarioUpdate,
  Incidencia,
  IncidenciaCreate,
  IncidenciaListFilterRequest,
  IncidenciaUpdate,
  Inscripcion,
  InscripcionBulkCreate,
  InscripcionBulkCreateResponse,
  InscripcionCreate,
  InscripcionListFilterRequest,
  InscripcionUpdate,
  Materia,
  MateriaCreate,
  MateriaListFilterRequest,
  MateriaUpdate,
  PlanEstudio,
  PlanEstudioCreate,
  PlanEstudioListFilterRequest,
  PlanEstudioUpdate,
  RegistroHorasServicioSocial,
  RegistroHorasServicioSocialBase,
  Salon,
  SalonListFilterRequest,
  SalonUpdate,
  ServicioSocial,
  ServicioSocialCreate,
  ServicioSocialListFilterRequest,
  ServicioSocialUpdate,
} from '../interfaces/academico.interface';
import { formatFilters } from '../utils/http.utils';
import { Docente } from '../interfaces/docente.interface';
import { Alumno } from '../interfaces/alumno.interface';
import { isFileSizeValid } from '../validators/file-size';

@Injectable({
  providedIn: 'root',
})
export class AcademicoService {
  ACADEMICO_API = environment.apiUrl + 'academico/';

  constructor(private http: HttpClient) {}

  CicloEscolarListApi(
    orderBy: string = '',
    order: string = '',
    filters?: CicloEscolarListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<CicloEscolar>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<CicloEscolar>>(
      this.ACADEMICO_API + 'ciclos-escolares',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  CicloEscolarCreateApi(cicloEscolar: CicloEscolar): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'ciclos-escolares/create/',
      cicloEscolar,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  CicloEscolarUpdateApi(
    id: CicloEscolar['id'],
    alumno: CicloEscolarUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'ciclos-escolares/' + id + '/update/',
      alumno,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  CicloEscolarDetailApi(id: CicloEscolar['id']): Observable<CicloEscolar> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<CicloEscolar>(
      this.ACADEMICO_API + 'ciclos-escolares/' + id,
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  GrupoListApi(
    orderBy: string = '',
    order: string = '',
    filters?: GrupoListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Grupo>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<Grupo>>(this.ACADEMICO_API + 'grupos', {
      params,
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  GrupoCreateApi(cicloEscolar: Grupo): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'grupos/create/',
      cicloEscolar,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  GrupoDetailApi(id: Grupo['id']): Observable<Grupo> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Grupo>(this.ACADEMICO_API + 'grupos/' + id, {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  GrupoUpdateApi(id: Grupo['id'], alumno: GrupoUpdate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'grupos/' + id + '/update/',
      alumno,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  InscripcionListApi(
    orderBy: string = '',
    order: string = '',
    filters?: InscripcionListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Inscripcion>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<Inscripcion>>(
      this.ACADEMICO_API + 'inscripciones',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  InscripcionCreateApi(inscripcion: InscripcionCreate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'inscripciones/create/',
      inscripcion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  InscripcionBulkCreateApi(
    inscripciones_data: InscripcionBulkCreate,
  ): Observable<InscripcionBulkCreateResponse> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<InscripcionBulkCreateResponse>(
      this.ACADEMICO_API + 'inscripciones/bulk-create/',
      inscripciones_data,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  InscripcionDetailApi(id: Inscripcion['id']): Observable<Inscripcion> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Inscripcion>(
      this.ACADEMICO_API + 'inscripciones/' + id,
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  InscripcionUpdateApi(
    id: Inscripcion['id'],
    inscripcion: InscripcionUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'inscripciones/' + id + '/update/',
      inscripcion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  MateriaListApi(
    orderBy: string = '',
    order: string = '',
    filters?: MateriaListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Materia>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<Materia>>(
      this.ACADEMICO_API + 'materias',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  MateriaCreateApi(materia: MateriaCreate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'materias/create/',
      materia,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  MateriaUpdateApi(id: Materia['id'], alumno: MateriaUpdate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'materias/' + id + '/update/',
      alumno,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  MateriaDetailApi(id: Materia['id']): Observable<Materia> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Materia>(this.ACADEMICO_API + 'materias/' + id, {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  PlanEstudioListApi(
    orderBy: string = '',
    order: string = '',
    filters?: PlanEstudioListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<PlanEstudio>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<PlanEstudio>>(
      this.ACADEMICO_API + 'planes-estudio',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  PlanEstudioCreateApi(planEstudio: PlanEstudioCreate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'planes-estudio/create/',
      planEstudio,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  PlanEstudioUpdateApi(
    id: PlanEstudio['id'],
    planEstudio: PlanEstudioUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'planes-estudio/' + id + '/update/',
      planEstudio,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  PlanEstudioDetailApi(id: PlanEstudio['id']): Observable<PlanEstudio> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<PlanEstudio>(
      this.ACADEMICO_API + 'planes-estudio/' + id,
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  HorarioListByGrupoApi(id: Grupo['id']): Observable<Horario[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Horario[]>(
      this.ACADEMICO_API + 'horarios/grupo/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HorarioListByDocenteApi(id: Docente['id_docente']): Observable<Horario[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Horario[]>(
      this.ACADEMICO_API + 'horarios/docente/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HorarioCreateApi(horario: HorarioCreate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'horarios/create/',
      horario,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HorarioUpdateApi(
    id: Horario['id'],
    horario: HorarioUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'horarios/' + id + '/update/',
      horario,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HorarioDeleteApi(id: Horario['id']): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.delete<void>(
      this.ACADEMICO_API + 'horarios/' + id + '/delete/',
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HistorialAcademicoListApi(
    orderBy: string = '',
    order: string = '',
    filters?: HistorialAcademicoListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<HistorialAcademico>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<HistorialAcademico>>(
      this.ACADEMICO_API + 'historial-academico',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HistorialAcademicoByAlumnoApi(
    id: Alumno['numero_control'],
  ): Observable<HistorialAcademicoByAlumno[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<HistorialAcademicoByAlumno[]>(
      this.ACADEMICO_API + 'historial-academico/alumno/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HistorialAcademicoByCicloEscolarApi(
    id: CicloEscolar['id'],
  ): Observable<HistorialAcademicoByAlumno[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<HistorialAcademicoByAlumno[]>(
      this.ACADEMICO_API + 'historial-academico/ciclo-escolar/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HistorialacademicoUpdateApi(
    id: HistorialAcademico['id'],
    historial: HistorialAcademicoUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'historial-academico/' + id + '/update/',
      historial,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  IncidenciaListApi(
    orderBy: string = '',
    order: string = '',
    filters?: IncidenciaListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Incidencia>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<Incidencia>>(
      this.ACADEMICO_API + 'incidencias',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  IncidenciaCreateApi(incidencia: IncidenciaCreate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'incidencias/create/',
      incidencia,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  IncidenciaUpdateApi(
    id: Incidencia['id'],
    alumno: IncidenciaUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'incidencias/' + id + '/update/',
      alumno,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  IncidenciaDetailApi(id: Incidencia['id']): Observable<Incidencia> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Incidencia>(this.ACADEMICO_API + 'incidencias/' + id, {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  ServicioSocialListApi(
    orderBy: string = '',
    order: string = '',
    filters?: ServicioSocialListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<ServicioSocial>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }

    return this.http.get<PaginatedData<ServicioSocial>>(
      this.ACADEMICO_API + 'servicios-sociales',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesServicioSocialDetailApi(
    id_servicio: ServicioSocial['id'],
  ): Observable<FileServicioSocial[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<FileServicioSocial[]>(
      this.ACADEMICO_API + `servicios-sociales/${id_servicio}/files`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesServicioSocialDownloadApi(
    id_servicio: ServicioSocial['id'],
    id_file_servicio: FileServicioSocial['id'],
  ): Observable<Blob> {
    return this.http.get(
      `${this.ACADEMICO_API}servicios-sociales/${id_servicio}/files/${id_file_servicio}/download`,
      {
        headers: new HttpHeaders({ ...BASE_HEADERS }),
        responseType: 'blob',
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesServicioSocialUploadApi(
    id_servicio: ServicioSocial['id'],
    file: File,
  ): Observable<void> {
    if (!isFileSizeValid(file)) {
      return throwError(
        () =>
          new Error(
            `El archivo excede el tamaño máximo permitido (${environment.MAX_FILE_SIZE_MB} MB)`,
          ),
      );
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(
      `${this.ACADEMICO_API}servicios-sociales/${id_servicio}/files/upload`,
      formData,
      {
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesServicioSocialDeleteApi(
    id_servicio: ServicioSocial['id'],
    id_file_servicio: FileServicioSocial['id'],
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.ACADEMICO_API}servicios-sociales/${id_servicio}/files/${id_file_servicio}/delete`,
      {
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
        headers: new HttpHeaders({ ...BASE_HEADERS }),
      },
    );
  }

  RegistroHorasServicioSocialCreateApi(
    id_servicio: ServicioSocial['id'],
    registro: RegistroHorasServicioSocialBase,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API +
        `servicios-sociales/` +
        id_servicio +
        `/registro-horas/create`,
      registro,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  RegistroHorasServicioSocialUpdateApi(
    id_servicio: ServicioSocial['id'],
    id_registro_servicio: RegistroHorasServicioSocial['id'],
    servicio: ServicioSocialUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API +
        `servicios-sociales/${id_servicio}/registro-horas/${id_registro_servicio}/update`,
      servicio,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  RegistroHorasServicioSocialDeleteApi(
    id_servicio: ServicioSocial['id'],
    id_registro_servicio: RegistroHorasServicioSocial['id'],
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.delete<void>(
      this.ACADEMICO_API +
        `servicios-sociales/${id_servicio}/registro-horas/${id_registro_servicio}/delete`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  RegistroHorasServicioSocialDetailApi(
    id_servicio: ServicioSocial['id'],
  ): Observable<RegistroHorasServicioSocial[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<RegistroHorasServicioSocial[]>(
      this.ACADEMICO_API + `servicios-sociales/${id_servicio}/registro-horas`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  ServicioSocialCreateApi(servicio: ServicioSocialCreate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'servicios-sociales/create/',
      servicio,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  ServicioSocialUpdateApi(
    id: ServicioSocial['id'],
    servicio: ServicioSocialUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'servicios-sociales/' + id + '/update/',
      servicio,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  ServicioSocialCompletadoToggleApi(
    id: ServicioSocial['id'],
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.patch<void>(
      this.ACADEMICO_API + 'servicios-sociales/' + id + '/complete/',
      {},
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  ServicioSocialDetailApi(
    id: ServicioSocial['id'],
  ): Observable<ServicioSocial> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<ServicioSocial>(
      this.ACADEMICO_API + 'servicios-sociales/' + id,
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }
  AsignacionDocenteListApi(
    orderBy: string = '',
    order: string = '',
    filters?: AsignacionDocenteListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<AsignacionDocente>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }

    return this.http.get<PaginatedData<AsignacionDocente>>(
      this.ACADEMICO_API + 'asignaciones-docentes',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsignacionDocenteCreateApi(
    asignacion: AsignacionDocenteCreate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.ACADEMICO_API + 'asignaciones-docentes/create/',
      asignacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsignacionDocenteUpdateApi(
    id: AsignacionDocente['id'],
    asignacion: AsignacionDocenteUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'asignaciones-docentes/' + id + '/update/',
      asignacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsignacionDocenteDetailApi(
    id: AsignacionDocente['id'],
  ): Observable<AsignacionDocente> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<AsignacionDocente>(
      this.ACADEMICO_API + 'asignaciones-docentes/' + id,
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  AsistenciaListApi(
    orderBy: string = '',
    order: string = '',
    filters?: AsistenciaListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Asistencia>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();
    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }

    return this.http.get<PaginatedData<Asistencia>>(
      this.ACADEMICO_API + 'asistencias',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  SalonListApi(
    orderBy: string = '',
    order: string = '',
    filters?: SalonListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Salon>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<Salon>>(this.ACADEMICO_API + 'salones', {
      params,
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  SalonCreateApi(salon: Salon): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(this.ACADEMICO_API + 'salones/create/', salon, {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  SalonUpdateApi(id: Salon['id'], salon: SalonUpdate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ACADEMICO_API + 'salones/' + id + '/update/',
      salon,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  SalonDetailApi(id: Salon['id']): Observable<Salon> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Salon>(this.ACADEMICO_API + 'salones/' + id, {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  AlumnoInRiskListApi(
    ciclo_escolar_id: CicloEscolar['id'],
    orderBy: string = '',
    order: string = '',
    filters?: AlumnoInRiskListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<any>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      params = formatFilters(filters, params);
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<any>>(
      this.ACADEMICO_API + `reporte/alumnos-in-risk/${ciclo_escolar_id}`,
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AlumnoInRiskAllApi(
    ciclo_escolar_id: CicloEscolar['id'],
  ): Observable<AlumnoInRisk[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    return this.http.get<AlumnoInRisk[]>(
      this.ACADEMICO_API + `reporte/alumnos-in-risk/${ciclo_escolar_id}/all`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }
}
