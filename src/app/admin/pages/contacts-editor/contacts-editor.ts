import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../core/admin-api.service';
import { ToastService } from '../../core/toast.service';
import { AdminInputComponent } from '../../ui/input/admin-input';

@Component({
  selector: 'app-admin-contacts-editor',
  standalone: true,
  imports: [AdminInputComponent, ReactiveFormsModule],
  template: `
    <h2 class="text-3xl font-bold text-navy">Contacts</h2>
    <p class="mt-1 text-premium-muted">Редактирование контактных данных публичного сайта.</p>

    <form class="mt-6 grid max-w-4xl gap-5 rounded-[1.5rem] bg-white p-6 shadow-card" [formGroup]="form" (ngSubmit)="save()">
      <div class="grid gap-5 md:grid-cols-2">
        <app-admin-input label="Phone" controlName="phone" />
        <app-admin-input label="Email" controlName="email" type="email" />
        <app-admin-input label="Address" controlName="address" />
        <app-admin-input label="Working hours" controlName="workingHours" />
        <app-admin-input label="Telegram" controlName="telegram" />
        <app-admin-input label="Map URL" controlName="mapUrl" />
      </div>
      <button type="submit" class="inline-flex min-h-12 w-fit items-center rounded-full bg-navy px-6 text-sm font-bold text-white">Save contacts</button>
    </form>
  `,
})
export class ContactsEditorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    workingHours: ['', Validators.required],
    telegram: [''],
    mapUrl: [''],
  });

  constructor() {
    this.api
      .getContacts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((contacts) => this.form.patchValue(contacts));
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.saveContacts(this.form.getRawValue()).subscribe(() => this.toast.show('Contacts saved'));
  }
}
