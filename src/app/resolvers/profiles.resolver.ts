import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { HttpResponseBody } from "../interfaces/http-response-body.interface";
import { ProfilesService } from "../services/profiles.service";

export const getAllProfilesPaginated:ResolveFn<HttpResponseBody> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot
)=>{

  return inject(ProfilesService).getAllPaginated();
}
