import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminApiService } from '../../core/admin-api.service';
import { MediaFileAdmin } from '../../core/admin.models';
import { ToastService } from '../../core/toast.service';
import { ConfirmModalComponent } from '../../ui/confirm-modal/confirm-modal';
import { AdminEmptyStateComponent } from '../../ui/empty-state/admin-empty-state';

@Component({
  selector: 'app-admin-media-library',
  standalone: true,
  imports: [AdminEmptyStateComponent, ConfirmModalComponent],
  template: `
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div><h2 class="text-3xl font-bold text-navy">Media library</h2><p class="mt-1 text-premium-muted">Загрузка, preview и удаление изображений.</p></div>
      <label class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-navy px-5 text-sm font-bold text-white">
        Upload image
        <input type="file" accept="image/*" class="sr-only" (change)="upload($event)" />
      </label>
    </div>

    @if (loading()) {
      <app-admin-empty-state label="Loading" message="Загружаем файлы..." />
    } @else if (files().length) {
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        @for (file of files(); track file.id) {
          <article class="overflow-hidden rounded-[1.5rem] bg-white shadow-card">
            <img [src]="file.url" [alt]="file.name" class="h-48 w-full object-cover" />
            <div class="p-5">
              <h3 class="truncate font-bold text-navy">{{ file.name }}</h3>
              <p class="mt-1 text-sm text-premium-muted">{{ file.size }}</p>
              <button type="button" class="mt-4 text-sm font-bold text-red-700" (click)="pendingDelete.set(file)">Delete</button>
            </div>
          </article>
        }
      </div>
    } @else {
      <app-admin-empty-state message="Медиафайлов пока нет." />
    }

    <app-confirm-modal [open]="!!pendingDelete()" title="Удалить файл?" [message]="pendingDelete()?.name ?? ''" (cancel)="pendingDelete.set(null)" (confirm)="deleteSelected()" />
  `,
})
export class MediaLibraryComponent {
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly files = signal<MediaFileAdmin[]>([]);
  protected readonly pendingDelete = signal<MediaFileAdmin | null>(null);

  constructor() {
    this.api
      .getMedia()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((files) => {
        this.files.set(files);
        this.loading.set(false);
      });
  }

  protected upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.api.uploadMedia(file).subscribe((uploaded) => {
      this.files.update((files) => [uploaded, ...files]);
      this.toast.show('Image uploaded');
      input.value = '';
    });
  }

  protected deleteSelected(): void {
    const file = this.pendingDelete();
    if (!file) {
      return;
    }
    this.api.deleteMedia(file.id).subscribe(() => {
      this.files.update((files) => files.filter((item) => item.id !== file.id));
      this.pendingDelete.set(null);
      this.toast.show('Image deleted');
    });
  }
}
