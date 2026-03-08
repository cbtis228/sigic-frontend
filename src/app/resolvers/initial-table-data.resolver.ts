import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { PaginatedDataService } from "../services/paginated-data.service";
import { PaginatedData } from "@/interfaces/paginated-data.interface";

export const getDataPaginated:ResolveFn<PaginatedData> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot
)=>{

  return inject(PaginatedDataService).getAllPaginated(route.data['endpointName']);
}
