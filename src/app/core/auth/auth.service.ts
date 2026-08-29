import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminRole, AuthResponse, AuthUser } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userState = signal<AuthUser | null>(null);
  private readonly accessTokenState = signal<string | null>(null);
  private initializationPromise: Promise<void> | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  readonly currentUser = this.userState.asReadonly();
  readonly accessToken = this.accessTokenState.asReadonly();
  readonly isAuthenticated = computed(
    () => Boolean(this.userState()) && Boolean(this.accessTokenState()),
  );
  readonly isSuperAdmin = computed(() => this.userState()?.role === 'SUPER_ADMIN');
  readonly isReadOnly = computed(() => this.userState()?.role === 'VIEWER');
  readonly isPreviewSession = computed(() => this.accessTokenState() === 'preview-access-token');

  initialize(): Promise<void> {
    this.initializationPromise ??= this.restoreSession();
    return this.initializationPromise;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(
        '/api/auth/login',
        { email, password },
        { withCredentials: true },
      ),
    );
    this.setSession(response);
    return response.user;
  }

  async refresh(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = firstValueFrom(
      this.http.post<AuthResponse>('/api/auth/refresh', {}, { withCredentials: true }),
    )
      .then((response) => {
        this.setSession(response);
        return response.accessToken;
      })
      .catch(() => {
        this.clearSession();
        return null;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>('/api/auth/logout', {}, { withCredentials: true }),
      );
    } finally {
      this.clearSession();
    }
  }

  hasRole(...roles: AdminRole[]): boolean {
    const role = this.userState()?.role;
    return Boolean(role && roles.includes(role));
  }

  startPreviewSession(): void {
    this.accessTokenState.set('preview-access-token');
    this.userState.set({
      userId: 'preview-admin',
      email: 'preview@finkeep.local',
      firstName: 'Preview',
      lastName: 'Admin',
      role: 'VIEWER',
      status: 'ACTIVE',
    });
  }

  clearSession(): void {
    this.accessTokenState.set(null);
    this.userState.set(null);
  }

  private async restoreSession(): Promise<void> {
    const token = await this.refresh();
    if (!token) {
      return;
    }

    try {
      const user = await firstValueFrom(this.http.get<AuthUser>('/api/auth/me'));
      this.userState.set(user);
    } catch {
      this.clearSession();
    }
  }

  private setSession(response: AuthResponse): void {
    this.accessTokenState.set(response.accessToken);
    this.userState.set(response.user);
  }
}
