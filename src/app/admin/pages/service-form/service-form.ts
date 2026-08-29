import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminApiService } from '../../core/admin-api.service';
import { AdminServiceItem, PublishStatus } from '../../core/admin.models';
import { ToastService } from '../../core/toast.service';
import { AdminInputComponent } from '../../ui/input/admin-input';
import { AdminTextareaComponent } from '../../ui/textarea/admin-textarea';

@Component({
  selector: 'app-admin-service-form',
  standalone: true,
  imports: [AdminInputComponent, AdminTextareaComponent, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/admin/services" class="text-sm font-bold text-premium-gold">← Services</a>
    <h2 class="mt-4 text-3xl font-bold text-navy">{{ serviceId() ? 'Edit service' : 'New service' }}</h2>

    <form class="mt-6 grid max-w-4xl gap-5 rounded-[1.5rem] bg-white p-6 shadow-card" [formGroup]="form" (ngSubmit)="save()">
      <div class="grid gap-5 md:grid-cols-2">
        <app-admin-input label="Название" controlName="title" [error]="error('title')" />
        <app-admin-input label="Slug" controlName="slug" [error]="error('slug')" />
      </div>
      <app-admin-textarea label="Краткое описание" controlName="shortDescription" [error]="error('shortDescription')" />
      <app-admin-textarea label="Полное описание" controlName="fullDescription" [error]="error('fullDescription')" />
      <div class="grid gap-5 md:grid-cols-3">
        <app-admin-input label="Иконка / image URL" controlName="imageUrl" />
        <app-admin-input label="Порядок" controlName="order" type="number" [error]="error('order')" />
        <label class="grid gap-2">
          <span class="text-sm font-bold text-navy">Status</span>
          <select class="min-h-12 rounded-2xl border border-premium-line px-4" formControlName="status">
            <option value="PUBLISHED">Published</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </label>
      </div>
      <button type="submit" class="inline-flex min-h-12 w-fit items-center rounded-full bg-navy px-6 text-sm font-bold text-white" [disabled]="saving()">
        {{ saving() ? 'Saving...' : 'Save service' }}
      </button>
    </form>
  `,
})
export class ServiceFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly serviceId = signal(this.route.snapshot.paramMap.get('id'));
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    shortDescription: ['', Validators.required],
    fullDescription: ['', Validators.required],
    imageUrl: [''],
    order: [1, [Validators.required, Validators.min(1)]],
    status: ['PUBLISHED' as PublishStatus, Validators.required],
  });

  constructor() {
    const id = this.serviceId();
    if (id) {
      this.api
        .getService(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((service) => {
          if (service) {
            this.form.patchValue(service);
          }
        });
    }
  }

  protected error(controlName: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[controlName];
    if (!control.invalid || !control.touched) {
      return null;
    }
    return control.hasError('pattern') ? 'Используйте латиницу, цифры и дефисы.' : 'Поле обязательно.';
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload: AdminServiceItem = {
      id: this.serviceId() ?? '',
      ...this.form.getRawValue(),
      updatedAt: new Date().toISOString(),
    };
    this.api.saveService(payload).subscribe({
      next: () => {
        this.toast.show('Service saved');
        void this.router.navigateByUrl('/admin/services');
      },
      error: () => {
        this.saving.set(false);
        this.toast.show('Could not save service', 'error');
      },
    });
  }
}
