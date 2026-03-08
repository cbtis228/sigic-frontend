import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpResponseBody } from '../interfaces/http-response-body.interface';
import { BASE_HEADERS } from '../global.constants';
import { PaginatedData } from '../interfaces/paginated-data.interface';
import { SelectOptionsInterface } from '../interfaces/select-options.interface';
import { DbProfileInterface } from '../interfaces/db-profile.interface';

const AUTH_API = environment.apiUrl + 'profiles'

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(
    private http: HttpClient
  ) { }

  getForm(): Observable<HttpResponseBody<SelectOptionsInterface[]>> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'false' })
    };
    return this.http.get<HttpResponseBody<SelectOptionsInterface[]>>(AUTH_API + '/form', headers);
  }

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

  register(data: DbProfileInterface): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'true' })
    };
    return this.http.post<HttpResponseBody>(AUTH_API, data, headers);
  }

  update(data: DbProfileInterface, id: number): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'true' })
    };
    return this.http.patch<HttpResponseBody>(AUTH_API + '/' + id, data, headers);
  }

  delete(id: number): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'true' })
    };
    return this.http.delete<HttpResponseBody>(AUTH_API + '/' + id, headers);
  }

}
