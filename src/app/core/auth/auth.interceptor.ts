import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isApiRequest = request.url.startsWith('/api/');
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => request.url.startsWith(endpoint));
  const token = auth.accessToken();
  if (auth.isPreviewSession()) {
    return next(request.clone({ withCredentials: isApiRequest }));
  }
  const authorizedRequest =
    isApiRequest && token && !isAuthEndpoint
      ? request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
      : request.clone({ withCredentials: isApiRequest });

  return next(authorizedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || !isApiRequest || isAuthEndpoint) {
        return throwError(() => error);
      }

      return from(auth.refresh()).pipe(
        switchMap((newToken) => {
          if (!newToken) {
            auth.clearSession();
            void router.navigate(['/admin/login']);
            return throwError(() => error);
          }
          return next(
            request.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
              withCredentials: true,
            }),
          );
        }),
      );
    }),
  );
};
