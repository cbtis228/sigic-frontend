import { Provider } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading-interceptor';

export const loadingInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true };