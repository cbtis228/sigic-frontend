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
import { Ubicacion, Bien, InventarioFisico, MovimientoInventario, UbicacionFilterRequest, UbicacionUpdate } from '../interfaces/inventario.interface';
import { formatFilters } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  INVENTARIO_API = environment.apiUrl + 'inventarios/';

  constructor(private http: HttpClient) {

  }

  UbicacionListApi(
    orderBy: string = '',
    order: string = '',
    filters?: UbicacionFilterRequest,
    offset: number = 0,
    limit: number = 10,
  ): Observable<PaginatedData<Ubicacion>> {
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
    return this.http.get<PaginatedData<Ubicacion>>(
      this.INVENTARIO_API + 'ubicaciones',
      {
        params,
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  UbicacionCreateApi(ubicacion: Ubicacion): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.post<void>(
      this.INVENTARIO_API + 'ubicaciones/create/',
      ubicacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  UbicacionUpdateApi(
    id: Ubicacion['id_ubicacion'],
    ubicacion: UbicacionUpdate,
  ): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.put<void>(
      this.INVENTARIO_API + 'ubicaciones/' + id + '/',
      ubicacion,
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

  UbicacionDetailApi(id: UbicacionUpdate['id_ubicacion']): Observable<Ubicacion> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.get<Ubicacion>(
      this.INVENTARIO_API + 'ubicaciones/' + id + '/',
      {
        ...headers,
        context: new HttpContext()
          .set(BYPASS_INTERCEPTOR_TOKEN, false)
          .set(BYPASS_INTERCEPTOR_LOADING, true),
      },
    );
  }

  UbicacionDeleteApi(id: Ubicacion['id_ubicacion']): Observable<void> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS }),
    };
    return this.http.delete<void>(
      this.INVENTARIO_API + 'ubicaciones/' + id + '/',
      {
        ...headers,
        context: new HttpContext().set(BYPASS_INTERCEPTOR_TOKEN, false),
      },
    );
  }

}
