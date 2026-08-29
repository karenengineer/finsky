export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'VIEWER'] as const;
export const ADMIN_STATUSES = ['ACTIVE', 'INVITED', 'BLOCKED', 'DELETED'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
export type AdminStatus = (typeof ADMIN_STATUSES)[number];

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  status: AdminStatus;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
