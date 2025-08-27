// app.config.ts
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors /*, withNoXsrfProtection, withXsrfConfiguration*/,
} from '@angular/common/http';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { environment } from '../enviroments/environment';

// 1) Interceptor de Base URL
const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Só prefixa se a URL for relativa (não começa com http)
  const isRelative = !/^https?:\/\//i.test(req.url);
  const url = isRelative ? new URL(req.url, environment.apiBaseUrl).toString() : req.url;
  return next(req.clone({ url }));
};

// 2) Interceptor de JSON (headers)
const jsonHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  // Só aplica Content-Type para body JSON
  const isJsonBody = req.body && !(req.body instanceof FormData);
  const headers = isJsonBody ? req.headers.set('Content-Type', 'application/json') : req.headers;
  return next(req.clone({ headers }));
};

// 3) Interceptor de Erros (log + normalização)
const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)
    .pipe
    // Importante: rxjs/operators em seus imports do serviço/componente
    // catchError aqui se preferir (ex.: throwError(() => new Error(...)))
    ();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, jsonHeadersInterceptor, errorInterceptor])
      // Se frontend e backend estiverem em domínios diferentes e você quer simplificar:
      // withNoXsrfProtection(),
      //
      // OU, se quiser customizar XSRF (quando usa cookies same-site, por ex.):
      // withXsrfConfiguration({
      //   cookieName: 'XSRF-TOKEN',
      //   headerName: 'X-XSRF-TOKEN',
      // }),
    ),
    provideRouter(routes),
  ],
};
