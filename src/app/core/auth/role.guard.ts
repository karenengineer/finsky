import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminRole } from './auth.models';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] as AdminRole[] | undefined) ?? [];

  return roles.length === 0 || auth.hasRole(...roles)
    ? true
    : router.createUrlTree(['/admin/access-denied']);
};
