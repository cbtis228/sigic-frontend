import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpResponseBody } from '../interfaces/http-response-body.interface';
import { BASE_HEADERS } from '../global.constants';
import { PaginatedData } from '../interfaces/paginated-data.interface';
import { BYPASS_INTERCEPTOR_TOKEN } from '../interceptors/token-interceptor';

const AUTH_API = environment.apiUrl
@Injectable({
  providedIn: 'root'
})
export class PaginatedDataService {

  constructor(
    private http: HttpClient
  ) { }

  getAllPaginated(
    endpointName: string,
    offset: number = 0,
    limit: number = 10,
    orderBy: string = '',
    order: string = 'asc',
    filters: string = '',
    globalFilter: string = ''): Observable<PaginatedData<any>> {
    const httpOptions = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'false' }),
      params: {
        offset: offset.toString(),
        limit: limit.toString(),
        order_by: orderBy,
        order: order,
        filters: filters,
        global_filter: globalFilter
      },
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
    };
    return this.http.get<PaginatedData>(AUTH_API + endpointName + '' , httpOptions);
  }

  getForm(endpointName: string): Observable<HttpResponseBody<FormData>> {
    const httpOptions = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'false' })
    };
    return this.http.get<HttpResponseBody<FormData>>(AUTH_API + endpointName + '/form', httpOptions);
  }

  getById(endpointName:string, id:number):Observable<HttpResponseBody<unknown>>{
    const httpOptions = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'false' })
    };
    return this.http.get<HttpResponseBody<unknown>>(AUTH_API + endpointName + '/' + id, httpOptions);
  }

}
