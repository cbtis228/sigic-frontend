import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ConfigService } from "../services/config.service";
import { CONST_CONFIG } from "../global.constants";
import { HttpResponseBody } from "../interfaces/http-response-body.interface";
import { UsersService } from "../services/users.service";

export const generalConfigResolver:ResolveFn<HttpResponseBody> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot
)=>{

  return inject(ConfigService).getAllNoFile();
}

export const usersResolver:ResolveFn<HttpResponseBody> = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot
)=>{

  return inject(UsersService).checkInitialUserExists();
}
