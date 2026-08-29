import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { AdminApiService } from '../../core/admin-api.service';
import { ConsultationRequestAdmin, RequestStatus } from '../../core/admin.models';
import { AdminBadgeComponent } from '../../ui/badge/admin-badge';
import { AdminEmptyStateComponent } from '../../ui/empty-state/admin-empty-state';
import { AdminPaginationComponent } from '../../ui/pagination/admin-pagination';
import { AdminTableComponent } from '../../ui/table/admin-table';

type StatusFilter = RequestStatus | 'ALL';

@Component({
  selector: 'app-admin-requests-list',
  standalone: true,
  imports: [AdminBadgeComponent, AdminEmptyStateComponent, AdminPaginationComponent, AdminTableComponent, DatePipe, ReactiveFormsModule, RouterLink],
  template: `
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><h2 class="text-3xl font-bold text-navy">Consultation requests</h2><p class="mt-1 text-premium-muted">Фильтрация, поиск и обработка заявок.</p></div>
      <div class="flex flex-col gap-3 md:flex-row">
        <input class="min-h-11 rounded-full border border-premium-line px-4 outline-none focus:border-premium-gold" [formControl]="query" placeholder="Name, phone or email" />
        <select class="min-h-11 rounded-full border border-premium-line px-4 outline-none" [formControl]="status">
          <option value="ALL">All statuses</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
    </div>

    @if (loading()) {
      <app-admin-empty-state label="Loading" message="Загружаем заявки..." />
    } @else if (pagedRequests().length) {
      <div class="grid gap-4">
        <app-admin-table>
          <thead class="bg-slate-50 text-xs uppercase tracking-[0.14em] text-premium-muted">
            <tr><th class="px-5 py-4">Клиент</th><th class="px-5 py-4">Контакт</th><th class="px-5 py-4">Услуга</th><th class="px-5 py-4">Дата</th><th class="px-5 py-4">Статус</th></tr>
          </thead>
          <tbody>
            @for (request of pagedRequests(); track request.id) {
              <tr class="border-t border-premium-line">
                <td class="px-5 py-4"><a [routerLink]="['/admin/requests', request.id]" class="font-bold text-navy">{{ request.name }}</a><p class="text-xs text-premium-muted">{{ request.company }}</p></td>
                <td class="px-5 py-4 text-premium-muted">{{ request.phone }}<br />{{ request.email }}</td>
                <td class="px-5 py-4 text-premium-muted">{{ request.service }}</td>
                <td class="px-5 py-4 text-premium-muted">{{ request.createdAt | date: 'medium' }}</td>
                <td class="px-5 py-4"><app-admin-badge [value]="request.status" /></td>
              </tr>
            }
          </tbody>
        </app-admin-table>
        <app-admin-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="page.set($event)" />
      </div>
    } @else {
      <app-admin-empty-state message="По текущим фильтрам заявок нет." />
    }
  `,
})
export class RequestsListComponent {
  private readonly api = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly query = new FormControl('', { nonNullable: true });
  protected readonly status = new FormControl<StatusFilter>('ALL', { nonNullable: true });
  protected readonly loading = signal(true);
  protected readonly requests = signal<ConsultationRequestAdmin[]>([]);
  protected readonly page = signal(1);
  protected readonly pageSize = 8;
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.requests().length / this.pageSize)));
  protected readonly pagedRequests = computed(() => this.requests().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));

  constructor() {
    this.query.valueChanges
      .pipe(
        startWith(this.query.value),
        debounceTime(160),
        switchMap((query) => this.api.getRequests(this.status.value, query)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((requests) => {
        this.requests.set(requests);
        this.loading.set(false);
        this.page.set(1);
      });

    this.status.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loading.set(true);
      this.api.getRequests(this.status.value, this.query.value).subscribe((requests) => {
        this.requests.set(requests);
        this.loading.set(false);
        this.page.set(1);
      });
    });
  }
}
