import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { HomeSectionCopy, ServiceSummary } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section id="consultation" class="bg-navy py-20 text-white md:py-28">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ copy().eyebrow }}</p>
          <h2 class="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
            {{ copy().title }}
          </h2>
          <p class="mt-6 text-lg leading-8 text-white/70">
            {{ copy().description }}
          </p>
        </div>

        <form class="rounded-[2rem] bg-white p-5 text-premium-ink shadow-premium md:p-8" [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid gap-5 md:grid-cols-2">
            <label class="grid gap-2">
              <span class="text-sm font-bold text-navy">Имя *</span>
              <input class="min-h-13 rounded-2xl border border-premium-line px-4 outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/10" formControlName="name" autocomplete="name" />
              @if (showError('name')) { <span class="text-sm text-red-700">{{ errorText('name') }}</span> }
            </label>

            <label class="grid gap-2">
              <span class="text-sm font-bold text-navy">Телефон *</span>
              <input class="min-h-13 rounded-2xl border border-premium-line px-4 outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/10" formControlName="phone" autocomplete="tel" />
              @if (showError('phone')) { <span class="text-sm text-red-700">{{ errorText('phone') }}</span> }
            </label>

            <label class="grid gap-2">
              <span class="text-sm font-bold text-navy">Email *</span>
              <input class="min-h-13 rounded-2xl border border-premium-line px-4 outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/10" formControlName="email" autocomplete="email" />
              @if (showError('email')) { <span class="text-sm text-red-700">{{ errorText('email') }}</span> }
            </label>

            <label class="grid gap-2">
              <span class="text-sm font-bold text-navy">Компания</span>
              <input class="min-h-13 rounded-2xl border border-premium-line px-4 outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/10" formControlName="company" autocomplete="organization" />
            </label>

            <label class="grid gap-2 md:col-span-2">
              <span class="text-sm font-bold text-navy">Интересующая услуга</span>
              <select class="min-h-13 rounded-2xl border border-premium-line px-4 outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/10" formControlName="service">
                <option value="">Выберите услугу</option>
                @for (service of services(); track service.id) {
                  <option [value]="service.slug">{{ service.title }}</option>
                }
              </select>
            </label>

            <label class="grid gap-2 md:col-span-2">
              <span class="text-sm font-bold text-navy">Сообщение</span>
              <textarea class="min-h-32 rounded-2xl border border-premium-line px-4 py-3 outline-none focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/10" formControlName="message"></textarea>
            </label>
          </div>

          <label class="mt-5 flex items-start gap-3 text-sm leading-6 text-premium-muted">
            <input type="checkbox" class="mt-1 size-4 rounded border-premium-line accent-navy" formControlName="consent" />
            <span>
              {{ copy().consentText }}
              <a routerLink="/privacy" class="font-bold text-navy underline">политикой конфиденциальности</a>.
            </span>
          </label>
          @if (showError('consent')) { <span class="mt-2 block text-sm text-red-700">{{ errorText('consent') }}</span> }

          @if (submitError()) {
            <p class="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">{{ submitError() }}</p>
          }

          <button
            type="submit"
            class="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-navy px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            [disabled]="isSubmitting()"
          >
            {{ isSubmitting() ? copy().submittingLabel : copy().submitLabel }}
          </button>
        </form>
      </div>
    </section>
  `,
})
export class ConsultationFormComponent {
  readonly services = input.required<ServiceSummary[]>();
  readonly copy = input.required<HomeSectionCopy['consultation']>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PublicContentApiService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    service: [''],
    message: [''],
    consent: [false, [Validators.requiredTrue]],
  });

  protected showError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected errorText(controlName: keyof typeof this.form.controls): string {
    const control = this.form.controls[controlName];
    if (control.hasError('required') || control.hasError('requiredTrue')) {
      return 'Это поле необходимо заполнить.';
    }
    if (control.hasError('email')) {
      return 'Введите корректный email.';
    }
    if (control.hasError('minlength')) {
      return 'Проверьте корректность значения.';
    }
    return 'Проверьте поле.';
  }

  protected submit(): void {
    this.submitError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.api
      .submitConsultationRequest(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl(this.copy().successRedirect),
        error: () => this.submitError.set('Не удалось отправить заявку. Проверьте соединение и попробуйте еще раз.'),
      });
  }
}
