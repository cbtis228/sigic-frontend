import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpResponseBody } from '../interfaces/http-response-body.interface';
import { BASE_HEADERS } from '../global.constants';
import { PaginatedData } from '../interfaces/paginated-data.interface';
import { DbUserInterface } from '../interfaces/db-user.interface';

const AUTH_API = environment.apiUrl + 'users'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  getAllPaginated(
    offset: number = 0,
    limit: number = 10,
    sort: string = '',
    order: string = 'ASC',
    filters: string = '',
    query: string = ''): Observable<HttpResponseBody<PaginatedData>> {
    const httpOptions = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true' }),
      params: {
        offset: offset.toString(),
        limit: limit.toString(),
        sort: sort,
        order: order,
        filters: filters,
        query: query
      }
    };
    return this.http.get<HttpResponseBody<PaginatedData>>(AUTH_API + '/paginated', httpOptions);
  }

  update(data: DbUserInterface, idUser: number): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'true' })
    };
    return this.http.patch<HttpResponseBody>(AUTH_API + '/' + idUser, data, headers);
  }
  
  delete(idUser: number): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'true' })
    };
    return this.http.delete<HttpResponseBody>(AUTH_API + '/' + idUser,  headers);
  }

  checkInitialUserExists(): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'true', 'showLoading': 'false', 'showSuccesfulResponse': 'true' })
    };
    return this.http.get<HttpResponseBody>(AUTH_API + '/check/initialUserExists', headers);
  }

}
