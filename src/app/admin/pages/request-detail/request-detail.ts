import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminApiService } from '../../core/admin-api.service';
import { ConsultationRequestAdmin, RequestStatus } from '../../core/admin.models';
import { ToastService } from '../../core/toast.service';
import { AdminBadgeComponent } from '../../ui/badge/admin-badge';
import { AdminEmptyStateComponent } from '../../ui/empty-state/admin-empty-state';

@Component({
  selector: 'app-admin-request-detail',
  standalone: true,
  imports: [AdminBadgeComponent, AdminEmptyStateComponent, DatePipe, RouterLink],
  template: `
    <a routerLink="/admin/requests" class="text-sm font-bold text-premium-gold">← Requests</a>

    @if (loading()) {
      <app-admin-empty-state label="Loading" message="Загружаем заявку..." />
    } @else if (request(); as item) {
      <section class="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <article class="rounded-[1.5rem] bg-white p-6 shadow-card">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 class="text-3xl font-bold text-navy">{{ item.name }}</h2>
              <p class="mt-2 text-premium-muted">{{ item.company || 'Компания не указана' }}</p>
            </div>
            <app-admin-badge [value]="item.status" />
          </div>
          <dl class="mt-8 grid gap-5 md:grid-cols-2">
            <div><dt class="text-xs font-bold uppercase tracking-[0.14em] text-premium-muted">Phone</dt><dd class="mt-2 font-bold text-navy">{{ item.phone }}</dd></div>
            <div><dt class="text-xs font-bold uppercase tracking-[0.14em] text-premium-muted">Email</dt><dd class="mt-2 font-bold text-navy">{{ item.email }}</dd></div>
            <div><dt class="text-xs font-bold uppercase tracking-[0.14em] text-premium-muted">Service</dt><dd class="mt-2 font-bold text-navy">{{ item.service }}</dd></div>
            <div><dt class="text-xs font-bold uppercase tracking-[0.14em] text-premium-muted">Submitted</dt><dd class="mt-2 font-bold text-navy">{{ item.createdAt | date: 'medium' }}</dd></div>
          </dl>
          <div class="mt-8 rounded-3xl bg-slate-50 p-5">
            <h3 class="font-bold text-navy">Message</h3>
            <p class="mt-3 leading-7 text-premium-muted">{{ item.message || 'Сообщение не указано.' }}</p>
          </div>
        </article>

        <aside class="rounded-[1.5rem] bg-white p-6 shadow-card">
          <h3 class="text-xl font-bold text-navy">Изменить статус</h3>
          <div class="mt-5 grid gap-3">
            @for (status of statuses; track status) {
              <button type="button" class="rounded-2xl border border-premium-line px-4 py-3 text-left text-sm font-bold text-navy hover:border-navy" (click)="setStatus(status)">
                {{ status }}
              </button>
            }
          </div>
        </aside>
      </section>
    } @else {
      <app-admin-empty-state message="Заявка не найдена." />
    }
  `,
})
export class RequestDetailComponent {
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly statuses: RequestStatus[] = ['NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];
  protected readonly loading = signal(true);
  protected readonly request = signal<ConsultationRequestAdmin | null>(null);

  constructor() {
    this.api
      .getRequest(this.route.snapshot.paramMap.get('id') ?? '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request) => {
        this.request.set(request);
        this.loading.set(false);
      });
  }

  protected setStatus(status: RequestStatus): void {
    const request = this.request();
    if (!request) {
      return;
    }
    this.api.updateRequestStatus(request.id, status).subscribe((updated) => {
      this.request.set(updated);
      this.toast.show('Request status updated');
    });
  }
}
