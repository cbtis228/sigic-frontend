import { HttpHeaders, HttpContext, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_HEADERS } from '../global.constants';
import { BYPASS_INTERCEPTOR_LOADING } from '../interceptors/loading-interceptor';
import { BYPASS_INTERCEPTOR_TOKEN } from '../interceptors/token-interceptor';
import {
  CicloEscolar,
  CicloEscolarUpdate,
} from '../interfaces/academico.interface';
import { Configuracion, ConfiguracionBase } from '../interfaces/core.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  CORE_API = environment.apiUrl + 'core/';

  constructor(private http: HttpClient) {}

  ConfiguracionUpdateApi(configuracion: ConfiguracionBase): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.CORE_API + 'configuracion/update/',
      configuracion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      }
    );
  }

  ConfiguracionDetailApi(): Observable<Configuracion> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Configuracion>(
      this.CORE_API + 'configuracion/detail',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      }
    );
  }
}
