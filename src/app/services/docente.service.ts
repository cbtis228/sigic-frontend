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
import {
  Capacitacion,
  CapacitacionBase,
  Docente,
  DocenteAsignacionDocente,
  DocenteAsistencia,
  DocenteCapacitacion,
  DocenteCapacitacionCreate,
  DocenteCapacitacionUpdate,
  DocenteGrupo,
  DocenteHistorialAcademico,
  DocenteInscripcionByGrupo,
  DocenteListFilterRequest,
  DocenteUpdate,
  FileCapacitacion,
  FileDocente,
} from '../interfaces/docente.interface';
import { BYPASS_INTERCEPTOR_LOADING } from '../interceptors/loading-interceptor';
import { PaginatedData } from '../interfaces/paginated-data.interface';
import {
  AsignacionDocente,
  DocenteGrupoDetail,
  Grupo,
  HistorialAcademico,
  Horario,
  Materia,
} from '../interfaces/academico.interface';
import { Alumno } from '../interfaces/alumno.interface';
import { isFileSizeValid } from '../validators/file-size';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  DOCENTES_API = environment.apiUrl + 'docentes/';

  constructor(private http: HttpClient) {}

  DocenteListApi(
    orderBy: string = '',
    order: string = '',
    filters?: DocenteListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Docente>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      for (const key of Object.keys(filters) as Array<
        keyof DocenteListFilterRequest
      >) {
        let field = filters[key];

        if (key === 'global_filter') {
          params = params.set(key, (field as string) ?? '');
        } else if (Array.isArray(field)) {
          for (const condition of field) {
            if (condition.value instanceof Date) {
              condition.value = condition.value.toISOString().split('T')[0];
            }
          }
          params = params.set(key, JSON.stringify(field));
        }
      }
    }

    if (orderBy) {
      params = params.set('order_by', orderBy);
    }
    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedData<Docente>>(this.DOCENTES_API, {
      params,
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  DocenteCreateApi(docente: Docente): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(this.DOCENTES_API + 'create/', docente, {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  DocenteUpdateApi(
    id: Docente['id_docente'],
    docente: DocenteUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(this.DOCENTES_API + id + '/update/', docente, {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  DocenteDetailApi(id: Docente['id_docente']): Observable<Docente> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Docente>(this.DOCENTES_API + id, {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  DocenteSelfDetailApi(): Observable<Docente> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Docente>(this.DOCENTES_API + 'me', {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  DocenteSelfUpdateApi(docente: DocenteUpdate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(this.DOCENTES_API + 'me/update/', docente, {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  HorarioSelfListCurrent(): Observable<Horario[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Horario[]>(this.DOCENTES_API + 'me/horarios/current', {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  GrupoSelfListByAsignacionDocente(
    id: AsignacionDocente['id'],
  ): Observable<DocenteGrupo[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteGrupo[]>(
      this.DOCENTES_API + 'me/asignacion-docente/' + id + '/grupo',
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsignacionDocenteSelfListCurrent(): Observable<DocenteAsignacionDocente[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteAsignacionDocente[]>(
      this.DOCENTES_API + 'me/asignacion-docente/current',
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsignacionDocenteSelfDetail(
    id: AsignacionDocente['id'],
  ): Observable<DocenteAsignacionDocente> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteAsignacionDocente>(
      this.DOCENTES_API + 'me/asignacion-docente/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HistorialAcademicoSelfListCurrent(
    id: Grupo['id'],
  ): Observable<DocenteHistorialAcademico[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteHistorialAcademico[]>(
      this.DOCENTES_API + 'me/historiales-academicos/asignacion-docente/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsignacionDocenteSelfListByGrupo(
    id: Grupo['id'],
  ): Observable<DocenteAsignacionDocente[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteAsignacionDocente[]>(
      this.DOCENTES_API + 'me/asignacion-docente/grupo/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  InscripcionSelfListByGrupo(
    id: Grupo['id'],
  ): Observable<DocenteInscripcionByGrupo[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteInscripcionByGrupo[]>(
      this.DOCENTES_API + 'me/grupos/' + id + '/inscripciones',
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  GrupoSelfDetail(id: Grupo['id']): Observable<DocenteGrupoDetail> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteGrupoDetail>(
      this.DOCENTES_API + 'me/grupos/' + id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HistorialAcademicoSelfListByMateriaAndGrupo(
    materia_id: Materia['id'],
    grupo_id: Grupo['id'],
  ): Observable<DocenteHistorialAcademico[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteHistorialAcademico[]>(
      this.DOCENTES_API +
        'me/historiales-academicos/materia/' +
        materia_id +
        '/grupo/' +
        grupo_id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsistenciaSelfListByHorarioAndFecha(
    horario_id: Horario['id'],
    fecha: string,
  ): Observable<DocenteAsistencia[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteAsistencia[]>(
      this.DOCENTES_API +
        'me/asistencias/horario/' +
        horario_id +
        '/fecha/' +
        fecha,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HorarioSelfListByGrupoAndAsignacionDocente(
    grupo_id: Grupo['id'],
    asignacion_id: AsignacionDocente['id'],
  ): Observable<(Horario & { dia_semana_display: string })[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<(Horario & { dia_semana_display: string })[]>(
      this.DOCENTES_API +
        'me/horarios/asignacion-docente/' +
        asignacion_id +
        '/grupo/' +
        grupo_id,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  HistorialAcademicoSelfCalificar(
    id: HistorialAcademico['id'],
    calificacion: number,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.DOCENTES_API + 'me/historiales-academicos/' + id + '/calificar',
      { calificacion },
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AsistenciaSelfRegistrar(
    id: Horario['id'],
    asistenciasObjects: {
      id: number | null;
      alumno: Alumno['numero_control'];
      hora: string | null;
      tipo: number | null;
      observaciones: string | null;
    }[],
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      `${this.DOCENTES_API}me/asistencias/horario/${id}/registrar`,
      asistenciasObjects,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesDocenteDetailApi(
    id_docente: Docente['id_docente'],
  ): Observable<FileDocente[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<FileDocente[]>(
      this.DOCENTES_API + `${id_docente}/files`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesDocenteDownloadApi(
    id_docente: Docente['id_docente'],
    id_file_docente: FileDocente['id'],
  ): Observable<Blob> {
    return this.http.get(
      `${this.DOCENTES_API}${id_docente}/files/${id_file_docente}/download`,
      {
        headers: new HttpHeaders({ ...BASE_HEADERS }),
        responseType: 'blob',
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesDocenteUploadApi(
    id_docente: Docente['id_docente'],
    tipo: FileDocente['tipo'],
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
    formData.append('tipo', String(tipo));

    return this.http.post<void>(
      `${this.DOCENTES_API}${id_docente}/files/upload/`,
      formData,
      {
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesDocenteDeleteApi(
    id_docente: Docente['id_docente'],
    id_file_docente: FileDocente['id'],
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.DOCENTES_API}${id_docente}/files/${id_file_docente}/delete`,
      {
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
        headers: new HttpHeaders({ ...BASE_HEADERS }),
      },
    );
  }
  CapacitacionSelfGetApi(): Observable<DocenteCapacitacion[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DocenteCapacitacion[]>(
      this.DOCENTES_API + `me/capacitaciones`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  CapacitacionSelfCreateApi(
    capacitacion: DocenteCapacitacionCreate,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<any>(
      this.DOCENTES_API + `me/capacitaciones/create/`,
      capacitacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }
  CapacitacionSelfUpdateApi(
    id: Capacitacion['id'],
    capacitacion: DocenteCapacitacionUpdate,
  ): Observable<any> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<any>(
      this.DOCENTES_API + `me/capacitaciones/${id}/update/`,
      capacitacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }
  CapacitacionSelfSoftDeleteApi(id: Capacitacion['id']): Observable<any> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.delete<any>(
      this.DOCENTES_API + `me/capacitaciones/${id}/delete`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesCapacitacionSelfDetailApi(
    id_capacitacion: Capacitacion['id'],
  ): Observable<FileCapacitacion[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<FileCapacitacion[]>(
      this.DOCENTES_API + `me/capacitaciones/${id_capacitacion}/files`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesCapacitacionSelfDownloadApi(
    id_capacitacion: Capacitacion['id'],
    id_file_servicio: FileCapacitacion['id'],
  ): Observable<Blob> {
    return this.http.get(
      `${this.DOCENTES_API}me/capacitaciones/${id_capacitacion}/files/${id_file_servicio}/download`,
      {
        headers: new HttpHeaders({ ...BASE_HEADERS }),
        responseType: 'blob',
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesCapacitacionUploadApi(
    id_capacitacion: Capacitacion['id'],
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
      `${this.DOCENTES_API}me/capacitaciones/${id_capacitacion}/files/upload`,
      formData,
      {
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesCapacitacionSelfSoftDeleteApi(
    id_capacitacion: Capacitacion['id'],
    id_file_servicio: FileCapacitacion['id'],
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.DOCENTES_API}me/capacitaciones/${id_capacitacion}/files/${id_file_servicio}/soft-delete`,
      {
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
        headers: new HttpHeaders({ ...BASE_HEADERS }),
      },
    );
  }

  CapacitacionGetApi(
    id_docente: Docente['id_docente'],
  ): Observable<Capacitacion[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Capacitacion[]>(
      this.DOCENTES_API + `${id_docente}/capacitaciones`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }
  FilesCapacitacionDetailApi(
    id_docente: Docente['id_docente'],
    id_capacitacion: Capacitacion['id'],
  ): Observable<FileCapacitacion[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<FileCapacitacion[]>(
      this.DOCENTES_API + `${id_docente}/capacitaciones/${id_capacitacion}/files`,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  FilesCapacitacionDownloadApi(
    id_docente: Docente['id_docente'],
    id_capacitacion: Capacitacion['id'],
    id_file_servicio: FileCapacitacion['id'],
  ): Observable<Blob> {
    return this.http.get(
      `${this.DOCENTES_API}${id_docente}/capacitaciones/${id_capacitacion}/files/${id_file_servicio}/download`,
      {
        headers: new HttpHeaders({ ...BASE_HEADERS }),
        responseType: 'blob',
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }
}
