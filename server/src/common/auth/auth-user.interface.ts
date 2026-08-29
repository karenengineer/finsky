import { AdminRole, AdminStatus } from '@prisma/client';

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  status: AdminStatus;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  type: 'access' | 'refresh';
  jti?: string;
}
