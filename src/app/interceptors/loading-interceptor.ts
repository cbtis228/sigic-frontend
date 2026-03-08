import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const BYPASS_INTERCEPTOR_LOADING = new HttpContextToken<boolean>(
  () => false,
);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  service_count = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.context.get(BYPASS_INTERCEPTOR_LOADING)) {
      return next.handle(req);
    }

    this.service_count++;

    setTimeout(() => {
      this.loadingService.loadingOn();
    });

    return next.handle(req).pipe(
      finalize(() => {
        this.service_count--;
        if (this.service_count === 0) {
          setTimeout(() => {
            this.loadingService.loadingOff();
          });
        }
      }),
    );
  }
}
