import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../core/admin-api.service';
import { AdminServiceItem } from '../../core/admin.models';
import { ToastService } from '../../core/toast.service';
import { AdminBadgeComponent } from '../../ui/badge/admin-badge';
import { AdminEmptyStateComponent } from '../../ui/empty-state/admin-empty-state';
import { ConfirmModalComponent } from '../../ui/confirm-modal/confirm-modal';
import { AdminTableComponent } from '../../ui/table/admin-table';

@Component({
  selector: 'app-admin-services-list',
  standalone: true,
  imports: [AdminBadgeComponent, AdminEmptyStateComponent, AdminTableComponent, ConfirmModalComponent, RouterLink],
  template: `
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div><h2 class="text-3xl font-bold text-navy">Services</h2><p class="mt-1 text-premium-muted">Добавление, редактирование, публикация и порядок услуг.</p></div>
      <a routerLink="/admin/services/new" class="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-bold text-white">+ Add service</a>
    </div>

    @if (loading()) {
      <app-admin-empty-state label="Loading" message="Загружаем услуги..." />
    } @else if (services().length) {
      <app-admin-table>
        <thead class="bg-slate-50 text-xs uppercase tracking-[0.14em] text-premium-muted">
          <tr><th class="px-5 py-4">Название</th><th class="px-5 py-4">Slug</th><th class="px-5 py-4">Order</th><th class="px-5 py-4">Status</th><th class="px-5 py-4"></th></tr>
        </thead>
        <tbody>
          @for (service of services(); track service.id) {
            <tr class="border-t border-premium-line">
              <td class="px-5 py-4"><div class="font-bold text-navy">{{ service.title }}</div><p class="max-w-xl text-sm text-premium-muted">{{ service.shortDescription }}</p></td>
              <td class="px-5 py-4 text-premium-muted">/{{ service.slug }}</td>
              <td class="px-5 py-4 text-premium-muted">{{ service.order }}</td>
              <td class="px-5 py-4"><app-admin-badge [value]="service.status" /></td>
              <td class="px-5 py-4 text-right">
                <a [routerLink]="['/admin/services', service.id, 'edit']" class="mr-3 font-bold text-navy">Edit</a>
                <button type="button" class="font-bold text-red-700" (click)="askDelete(service)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </app-admin-table>
    } @else {
      <app-admin-empty-state message="Услуги пока не созданы." />
    }

    <app-confirm-modal [open]="!!pendingDelete()" title="Удалить услугу?" [message]="pendingDelete()?.title ?? ''" (cancel)="pendingDelete.set(null)" (confirm)="deleteSelected()" />
  `,
})
export class ServicesListComponent {
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly services = signal<AdminServiceItem[]>([]);
  protected readonly pendingDelete = signal<AdminServiceItem | null>(null);

  constructor() {
    this.load();
  }

  protected askDelete(service: AdminServiceItem): void {
    this.pendingDelete.set(service);
  }

  protected deleteSelected(): void {
    const service = this.pendingDelete();
    if (!service) {
      return;
    }
    this.api.deleteService(service.id).subscribe(() => {
      this.services.update((items) => items.filter((item) => item.id !== service.id));
      this.pendingDelete.set(null);
      this.toast.show('Service deleted');
    });
  }

  private load(): void {
    this.api
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((services) => {
        this.services.set(services);
        this.loading.set(false);
      });
  }
}
