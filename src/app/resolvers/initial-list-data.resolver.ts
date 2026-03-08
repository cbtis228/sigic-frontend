import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { HttpResponseBody } from "../interfaces/http-response-body.interface";
import { PaginatedDataService } from "../services/paginated-data.service";
export const getDataForm:ResolveFn<HttpResponseBody> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot
)=>{

  return inject(PaginatedDataService).getForm(route.data['endpointName']);
}