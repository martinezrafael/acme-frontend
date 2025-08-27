import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, throwError, timeout, retry } from 'rxjs';

const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isRelative = !/^https?:\/\//i.test(req.url);
  const url = isRelative ? new URL(req.url, environment.apiBaseUrl).toString() : req.url;
  return next(req.clone({ url }));
};

const jsonHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const isJsonBody = !!req.body && !(req.body instanceof FormData);
  const headers = isJsonBody ? req.headers.set('Content-Type', 'application/json') : req.headers;
  return next(req.clone({ headers }));
};

const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    timeout(15000),
    retry({ count: 1, delay: 250, resetOnSuccess: true }),
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        console.error('[HTTP]', req.method, req.url, '=>', error.status, error.message);
      } else {
        console.error('[HTTP]', req.method, req.url, '=>', error);
      }
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, jsonHeadersInterceptor, errorInterceptor])
    ),
    provideRouter(routes),
  ],
};
