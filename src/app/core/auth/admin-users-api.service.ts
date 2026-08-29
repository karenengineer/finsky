import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AdminRole, AdminStatus, AdminUserRecord } from './auth.models';

export interface CreateAdminUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  status: AdminStatus;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersApiService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<AdminUserRecord[]>('/api/admin/users');
  }

  create(payload: CreateAdminUserPayload) {
    return this.http.post<AdminUserRecord>('/api/admin/users', payload);
  }

  updateRole(id: string, role: AdminRole) {
    return this.http.patch<AdminUserRecord>(`/api/admin/users/${id}`, { role });
  }

  updateStatus(id: string, status: AdminStatus) {
    return this.http.patch<AdminUserRecord>(`/api/admin/users/${id}/status`, { status });
  }

  remove(id: string) {
    return this.http.delete<void>(`/api/admin/users/${id}`);
  }
}
