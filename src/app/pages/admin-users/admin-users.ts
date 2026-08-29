import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AdminUsersApiService } from '../../core/auth/admin-users-api.service';
import {
  ADMIN_ROLES,
  ADMIN_STATUSES,
  AdminRole,
  AdminStatus,
  AdminUserRecord,
} from '../../core/auth/auth.models';
import { AuthService } from '../../core/auth/auth.service';
import { LocalizationService } from '../../core/i18n/localization.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../shared/language-switcher/language-switcher';

type PendingAction =
  | { type: 'status'; user: AdminUserRecord; status: AdminStatus }
  | { type: 'delete'; user: AdminUserRecord };

@Component({
  selector: 'app-admin-users',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsersComponent {
  private readonly api = inject(AdminUsersApiService);
  private readonly auth = inject(AuthService);
  private readonly localization = inject(LocalizationService);

  readonly users = signal<AdminUserRecord[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal(false);
  readonly createOpen = signal(false);
  readonly pendingAction = signal<PendingAction | null>(null);
  readonly roles = ADMIN_ROLES;
  readonly statuses = ADMIN_STATUSES.filter((status) => status !== 'DELETED');
  readonly currentUser = this.auth.currentUser;
  readonly currentUserInitials = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` : '';
  });
  readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,128}$/),
      ],
    }),
    role: new FormControl<AdminRole>('ADMIN', { nonNullable: true }),
    status: new FormControl<AdminStatus>('ACTIVE', { nonNullable: true }),
  });

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      this.users.set(await firstValueFrom(this.api.list()));
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      const created = await firstValueFrom(this.api.create(this.form.getRawValue()));
      this.users.update((users) => [created, ...users]);
      this.createOpen.set(false);
      this.form.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'ADMIN',
        status: 'ACTIVE',
      });
    } catch {
      this.error.set(true);
    } finally {
      this.saving.set(false);
    }
  }

  async changeRole(user: AdminUserRecord, event: Event): Promise<void> {
    const role = (event.target as HTMLSelectElement).value as AdminRole;
    if (role === user.role) return;
    try {
      const updated = await firstValueFrom(this.api.updateRole(user.id, role));
      this.replace(updated);
    } catch {
      await this.load();
    }
  }

  requestStatusChange(user: AdminUserRecord): void {
    const status: AdminStatus = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    this.pendingAction.set({ type: 'status', user, status });
  }

  requestDelete(user: AdminUserRecord): void {
    this.pendingAction.set({ type: 'delete', user });
  }

  async confirmAction(): Promise<void> {
    const action = this.pendingAction();
    if (!action || this.saving()) return;
    this.saving.set(true);
    try {
      if (action.type === 'delete') {
        await firstValueFrom(this.api.remove(action.user.id));
        this.users.update((users) => users.filter((user) => user.id !== action.user.id));
      } else {
        const updated = await firstValueFrom(
          this.api.updateStatus(action.user.id, action.status),
        );
        this.replace(updated);
      }
      this.pendingAction.set(null);
    } catch {
      this.error.set(true);
    } finally {
      this.saving.set(false);
    }
  }

  formatDate(value: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(this.localization.locale(), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    location.assign('/admin/login');
  }

  private replace(updated: AdminUserRecord): void {
    this.users.update((users) => users.map((user) => (user.id === updated.id ? updated : user)));
  }
}
