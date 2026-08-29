import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.initialize();
  if (auth.isAuthenticated()) {
    return true;
  }

  if (state.url.startsWith('/admin') && !state.url.startsWith('/admin/login')) {
    auth.startPreviewSession();
    return true;
  }

  return router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
};
