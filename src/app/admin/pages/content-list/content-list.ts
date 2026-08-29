import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../core/admin-api.service';
import { ContentItem, ContentType } from '../../core/admin.models';
import { ToastService } from '../../core/toast.service';
import { AdminBadgeComponent } from '../../ui/badge/admin-badge';
import { ConfirmModalComponent } from '../../ui/confirm-modal/confirm-modal';
import { AdminEmptyStateComponent } from '../../ui/empty-state/admin-empty-state';
import { AdminTableComponent } from '../../ui/table/admin-table';

@Component({
  selector: 'app-admin-content-list',
  standalone: true,
  imports: [AdminBadgeComponent, AdminEmptyStateComponent, AdminTableComponent, ConfirmModalComponent],
  template: `
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-3xl font-bold text-navy">{{ title() }}</h2>
        <p class="mt-1 text-premium-muted">Управление публикацией, порядком и содержимым раздела.</p>
      </div>
      <button type="button" class="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-bold text-white">+ Add item</button>
    </div>

    @if (loading()) {
      <app-admin-empty-state label="Loading" message="Загружаем раздел..." />
    } @else if (items().length) {
      <app-admin-table>
        <thead class="bg-slate-50 text-xs uppercase tracking-[0.14em] text-premium-muted">
          <tr><th class="px-5 py-4">Title</th><th class="px-5 py-4">Description</th><th class="px-5 py-4">Order</th><th class="px-5 py-4">Status</th><th class="px-5 py-4"></th></tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr class="border-t border-premium-line">
              <td class="px-5 py-4 font-bold text-navy">{{ item.title }}</td>
              <td class="px-5 py-4 text-premium-muted">{{ item.description }}</td>
              <td class="px-5 py-4 text-premium-muted">{{ item.order }}</td>
              <td class="px-5 py-4"><app-admin-badge [value]="item.status" /></td>
              <td class="px-5 py-4 text-right"><button type="button" class="font-bold text-red-700" (click)="pendingDelete.set(item)">Delete</button></td>
            </tr>
          }
        </tbody>
      </app-admin-table>
    } @else {
      <app-admin-empty-state message="В этом разделе пока нет записей." />
    }

    <app-confirm-modal [open]="!!pendingDelete()" title="Удалить запись?" [message]="pendingDelete()?.title ?? ''" (cancel)="pendingDelete.set(null)" (confirm)="deleteSelected()" />
  `,
})
export class ContentListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly type = signal<ContentType>((this.route.snapshot.data['contentType'] as ContentType) ?? 'pages');
  protected readonly title = computed(() => {
    const titles: Record<ContentType, string> = {
      pages: 'Pages content',
      benefits: 'Benefits',
      statistics: 'Statistics',
      'work-steps': 'Work steps',
      testimonials: 'Testimonials',
      faq: 'FAQ',
    };
    return titles[this.type()];
  });
  protected readonly loading = signal(true);
  protected readonly items = signal<ContentItem[]>([]);
  protected readonly pendingDelete = signal<ContentItem | null>(null);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.type.set((data['contentType'] as ContentType) ?? 'pages');
      this.load();
    });
  }

  protected deleteSelected(): void {
    const item = this.pendingDelete();
    if (!item) {
      return;
    }
    this.api.deleteContent(this.type(), item.id).subscribe(() => {
      this.items.update((items) => items.filter((current) => current.id !== item.id));
      this.pendingDelete.set(null);
      this.toast.show('Item deleted');
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api
      .getContent(this.type())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.items.set(items);
        this.loading.set(false);
      });
  }
}
