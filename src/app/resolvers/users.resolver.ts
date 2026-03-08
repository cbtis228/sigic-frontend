import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { HttpResponseBody } from "../interfaces/http-response-body.interface";
import { UsersService } from "../services/users.service";

export const getAllUsersPaginated:ResolveFn<HttpResponseBody> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot
)=>{

  return inject(UsersService).getAllPaginated();
}
