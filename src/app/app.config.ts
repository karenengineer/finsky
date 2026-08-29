import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LocalizationService } from './core/i18n/localization.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { localeInterceptor } from './core/i18n/locale.interceptor';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([localeInterceptor, authInterceptor])),
    provideAppInitializer(() => inject(LocalizationService).initialize()),
    provideAppInitializer(() => inject(AuthService).initialize()),
  ],
};
