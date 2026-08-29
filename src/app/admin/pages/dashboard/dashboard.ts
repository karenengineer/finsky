import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../core/admin-api.service';
import { AdminDashboard } from '../../core/admin.models';
import { AdminBadgeComponent } from '../../ui/badge/admin-badge';
import { AdminEmptyStateComponent } from '../../ui/empty-state/admin-empty-state';
import { AdminTableComponent } from '../../ui/table/admin-table';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminBadgeComponent, AdminEmptyStateComponent, AdminTableComponent, RouterLink],
  template: `
    @if (loading()) {
      <app-admin-empty-state label="Loading" message="Загружаем dashboard..." />
    } @else if (dashboard(); as data) {
      <div class="grid gap-6">
        <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article class="rounded-[1.5rem] bg-white p-6 shadow-card"><p class="text-sm text-premium-muted">Всего заявок</p><strong class="mt-3 block text-4xl text-navy">{{ data.totalRequests }}</strong></article>
          <article class="rounded-[1.5rem] bg-white p-6 shadow-card"><p class="text-sm text-premium-muted">Новые заявки</p><strong class="mt-3 block text-4xl text-navy">{{ data.newRequests }}</strong></article>
          <article class="rounded-[1.5rem] bg-white p-6 shadow-card"><p class="text-sm text-premium-muted">Опубликовано услуг</p><strong class="mt-3 block text-4xl text-navy">{{ data.publishedServices }}</strong></article>
          <article class="rounded-[1.5rem] bg-white p-6 shadow-card"><p class="text-sm text-premium-muted">Отзывы</p><strong class="mt-3 block text-4xl text-navy">{{ data.testimonials }}</strong></article>
        </section>

        <section>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-navy">Последние заявки</h2>
            <a routerLink="/admin/requests" class="text-sm font-bold text-premium-gold">Все заявки →</a>
          </div>
          @if (data.latestRequests.length) {
            <app-admin-table>
              <thead class="bg-slate-50 text-xs uppercase tracking-[0.14em] text-premium-muted">
                <tr><th class="px-5 py-4">Клиент</th><th class="px-5 py-4">Контакт</th><th class="px-5 py-4">Услуга</th><th class="px-5 py-4">Статус</th></tr>
              </thead>
              <tbody>
                @for (request of data.latestRequests; track request.id) {
                  <tr class="border-t border-premium-line">
                    <td class="px-5 py-4"><a [routerLink]="['/admin/requests', request.id]" class="font-bold text-navy">{{ request.name }}</a><p class="text-xs text-premium-muted">{{ request.company }}</p></td>
                    <td class="px-5 py-4 text-premium-muted">{{ request.phone }}<br />{{ request.email }}</td>
                    <td class="px-5 py-4 text-premium-muted">{{ request.service }}</td>
                    <td class="px-5 py-4"><app-admin-badge [value]="request.status" /></td>
                  </tr>
                }
              </tbody>
            </app-admin-table>
          } @else {
            <app-admin-empty-state message="Заявок пока нет." />
          }
        </section>
      </div>
    }
  `,
})
export class DashboardComponent {
  private readonly api = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly dashboard = signal<AdminDashboard | null>(null);

  constructor() {
    this.api
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dashboard) => {
        this.dashboard.set(dashboard);
        this.loading.set(false);
      });
  }
}
