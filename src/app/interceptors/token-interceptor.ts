import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { Observable, throwError, from, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

export const BYPASS_INTERCEPTOR_TOKEN = new HttpContextToken(() => true);

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.context.get(BYPASS_INTERCEPTOR_TOKEN)) {
      return next.handle(req);
    }

    return from(this.storageService.retrieveData<string>('access')).pipe(
      switchMap((access) =>
        from(this.storageService.retrieveData<string>('refresh')).pipe(
          switchMap((refresh) => {
            let request = req;

            if (access) {
              const payload = JSON.parse(atob(access.split('.')[1]));
              const now = Math.floor(Date.now() / 1000);

              if (payload.exp && payload.exp <= now) {
                if (refresh) {
                  return this.authService.refreshAccess(refresh).pipe(
                    switchMap((response) =>
                      from(
                        this.storageService.storeData('access', response.access)
                      ).pipe(
                        switchMap(() => {
                          const clonedRequest = req.clone({
                            setHeaders: {
                              authorization: `Bearer ${response.access}`,
                            },
                          });

                          return next.handle(clonedRequest) 
                        }),
                        catchError((storeError) => {
                          if(storeError.status !== 500) return EMPTY
                          console.error('Error al guardar el token:', storeError);
                          this.storageService.logOut(true);
                          this.router.navigateByUrl('auth/login');
                          return throwError(() => storeError);
                        })
                      )
                    ),
                    catchError((refreshError) => {
                      console.error('Error al refrescar el token:', refreshError);
                      this.storageService.logOut(true);
                      this.router.navigateByUrl('auth/login');
                      return throwError(
                        () => new Error('Token expirado y sin refresh')
                      );
                    })
                  );
                } else {
                  this.storageService.logOut(true);
                  this.router.navigateByUrl('auth/login');
                  return throwError(
                    () => new Error('Token expirado y sin refresh')
                  );
                }
              } else {
                request = req.clone({
                  setHeaders: {
                    authorization: `Bearer ${access}`,
                  },
                });
              }
            }

            return next.handle(request).pipe(
              catchError((err) => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                  console.warn('Token inválido, redirigiendo al login...');
                  this.storageService.logOut(true);
                  this.router.navigateByUrl('auth/login');
                }
                return throwError(() => err);
              })
            );
          })
        )
      )
    );
  }
}
