import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalizationService } from './localization.service';

export const localeInterceptor: HttpInterceptorFn = (request, next) => {
  const language = inject(LocalizationService).language();

  return next(
    request.clone({
      setHeaders: {
        'Accept-Language': language,
      },
    }),
  );
};
