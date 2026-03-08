import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Alumno,
  AlumnoCreate,
  AlumnoHistorialAcademico,
  AlumnoHorario,
  AlumnoInscripcion,
  AlumnoListFilterRequest,
  AlumnoServicioSocial,
  AlumnoUpdate,
  ContactoEmergencia,
  ContactoEmergenciaUpdate,
  DatosFacturacion,
  DatosFacturacionUpdate,
} from '../interfaces/alumno.interface';
import { environment } from '../environments/environment.dev';
import { BASE_HEADERS } from '../global.constants';
import { BYPASS_INTERCEPTOR_TOKEN } from '../interceptors/token-interceptor';
import { BYPASS_INTERCEPTOR_LOADING } from '../interceptors/loading-interceptor';
import { PaginatedData } from '../interfaces/paginated-data.interface';
import { ServicioSocial } from '../interfaces/academico.interface';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  ALUMNOS_API = environment.apiUrl + 'alumnos/';

  constructor(private http: HttpClient) {}

  AlumnoListApi(
    orderBy: string = '',
    order: string = '',
    filters?: AlumnoListFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Alumno>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };

    let params = new HttpParams();

    params = params.set('offset', offset.toString());
    params = params.set('limit', limit.toString());

    if (filters) {
      for (const key of Object.keys(filters) as Array<
        keyof AlumnoListFilterRequest
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
    return this.http.get<PaginatedData<Alumno>>(this.ALUMNOS_API, {
      params,
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  AlumnoDetailApi(
    numero_control: Alumno['numero_control'],
  ): Observable<Alumno> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Alumno>(this.ALUMNOS_API + numero_control, {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  AlumnoCreateApi(alumno: AlumnoCreate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(this.ALUMNOS_API + 'create/', alumno, {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }
  AlumnoUpdateApi(
    numero_control: Alumno['numero_control'],
    alumno: AlumnoUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ALUMNOS_API + numero_control + '/update/',
      alumno,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  AlumnoSelfDetailApi(): Observable<Alumno> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Alumno>(this.ALUMNOS_API + 'me', {
      ...headers,
      context: new HttpContext()
        .set(BYPASS_INTERCEPTOR_TOKEN, false)
        .set(BYPASS_INTERCEPTOR_LOADING, true),
    });
  }

  AlumnoSelfUpdateApi(alumno: AlumnoUpdate): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(this.ALUMNOS_API + 'me/update/', alumno, {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }

  ContactoEmergenciaFromAlumnoApi(
    numero_control: string,
  ): Observable<ContactoEmergencia[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<ContactoEmergencia[]>(
      this.ALUMNOS_API + numero_control + '/contactos-emergencia',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  ContactoEmergenciaUpdateApi(
    id: ContactoEmergencia['id'],
    contactoEmergencia: ContactoEmergenciaUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ALUMNOS_API + 'contactos-emergencia/' + id + '/update/',
      contactoEmergencia,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  ContactoEmergenciaSelfListApi(): Observable<ContactoEmergencia[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<ContactoEmergencia[]>(
      this.ALUMNOS_API + 'me/contactos-emergencia',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  ContactoEmergenciaSelfUpdateApi(
    id: ContactoEmergencia['id'],
    contactoEmergencia: ContactoEmergenciaUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ALUMNOS_API + 'me/contactos-emergencia/' + id + '/update/',
      contactoEmergencia,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  DatosFacturacionFromAlumnoApi(
    numero_control: string,
  ): Observable<DatosFacturacion> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DatosFacturacion>(
      this.ALUMNOS_API + numero_control + '/datos-facturacion',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  DatosFacturacionUpdateApi(
    numero_control: Alumno['numero_control'],
    DatosFacturacion: DatosFacturacionUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ALUMNOS_API + numero_control + '/datos-facturacion/update/',
      DatosFacturacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  DatosFacturacionSelfUpdateApi(
    DatosFacturacion: DatosFacturacionUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.ALUMNOS_API + 'me/datos-facturacion/update/',
      DatosFacturacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  DatosFacturacionSelfDetailApi(): Observable<DatosFacturacion> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<DatosFacturacion>(
      this.ALUMNOS_API + 'me/datos-facturacion',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  HorarioSelfListCurrentApi(): Observable<AlumnoHorario[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<AlumnoHorario[]>(
      this.ALUMNOS_API + 'me/horarios/current',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  HistorialSelfListCurrentApi(): Observable<AlumnoHistorialAcademico[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<AlumnoHistorialAcademico[]>(
      this.ALUMNOS_API + 'me/historiales-academicos/current',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  InscripcionSelfListApi(): Observable<AlumnoInscripcion[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<AlumnoInscripcion[]>(
      this.ALUMNOS_API + 'me/inscripciones',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
      },
    );
  }

  HistorialSelfListByInscripcionApi(
    inscripcionId: number,
  ): Observable<AlumnoHistorialAcademico[]> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<AlumnoHistorialAcademico[]>(
      this.ALUMNOS_API +
        'me/historiales-academicos/inscripcion/' +
        inscripcionId,
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
      },
    );
  }

  ServicioSocialSelfGetApi(
  ): Observable<AlumnoServicioSocial> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<AlumnoServicioSocial>(
      this.ALUMNOS_API +
        'me/servicio-social',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }
}
