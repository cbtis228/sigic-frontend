import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpResponseBody } from '../interfaces/http-response-body.interface';
import { BASE_HEADERS } from '../global.constants';
import { DbUserInterface } from '../interfaces/db-user.interface';
import { BYPASS_INTERCEPTOR_TOKEN } from '../interceptors/token-interceptor';

const AUTH_API = environment.apiUrl + 'authentication/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}


  loginWithCredentials(
    username: string,
    password: string,
  ): Observable<{ access: string; refresh: string }> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<{ access: string; refresh: string }>(
      AUTH_API + 'deprecated/obtain/',
      {
        username,
        password,
      },
      headers,
    );
  }

  exchangeCodeGoogle(
    code: string,
  ): Observable<{ access: string; refresh: string }> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<{ access: string; refresh: string }>(
      AUTH_API + 'exchange-code/google-oauth2/',
      {
        code,
      },
      headers,
    );
  }

  refreshAccess(refresh: string): Observable<{ access: string }> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<{ access: string }>(
      AUTH_API + 'refresh/',
      {
        refresh,
      },
      headers,
    );
  }

  verifyAccess(access: string): Observable<{}> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<{}>(
      AUTH_API + 'verify/',
      {
        token: access,
      },
      headers,
    );
  }

  getUserPermissions(): Observable<{ permissions: string[] }> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<{ permissions: string[] }>(
      AUTH_API + 'self-permissions/',
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  getUserRole(): Observable<{
    role: string;
    nombres: string;
    paterno: string;
    materno: string;
    numero_control?: string;
    id_docente?: number;
  }> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<{
      role: string;
      nombres: string;
      paterno: string;
      materno: string;
      numero_control?: string;
      id_docente?: number;
    }>(AUTH_API + 'self-role/', {
      ...headers,
      context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    });
  }
}
