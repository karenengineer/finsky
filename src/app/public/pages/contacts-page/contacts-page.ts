import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { ApiState, ContactSettings, HomeSectionCopy, ServiceSummary } from '../../../core/public-api/public-content.models';
import { SeoService } from '../../../core/seo/seo.service';
import { ConsultationFormComponent } from '../../components/consultation-form/consultation-form';
import { SectionStateComponent } from '../../components/section-state/section-state';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [ConsultationFormComponent, SectionStateComponent],
  template: `
    @if (state().status === 'loading') {
      <app-section-state label="Загрузка" message="Загружаем контакты..." />
    } @else if (state().data; as contacts) {
      <section class="bg-premium-paper/70 py-20 md:py-28">
        <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">Контакты</p>
          <h1 class="mt-4 max-w-4xl font-display text-5xl leading-tight tracking-[-0.04em] text-navy md:text-7xl">{{ contacts.title }}</h1>
          <p class="mt-7 max-w-3xl text-xl leading-9 text-premium-muted">{{ contacts.description }}</p>
        </div>
      </section>
      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">Телефон</b><p class="mt-3 text-premium-muted">{{ contacts.phone }}</p></div>
          <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">Email</b><p class="mt-3 text-premium-muted">{{ contacts.email }}</p></div>
          <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">Адрес</b><p class="mt-3 text-premium-muted">{{ contacts.address }}</p></div>
          <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">Время работы</b><p class="mt-3 text-premium-muted">{{ contacts.workingHours }}</p></div>
        </div>
      </section>
      <app-consultation-form [services]="services()" [copy]="consultationCopy" />
    } @else {
      <app-section-state label="Ошибка" [message]="state().error ?? 'Не удалось загрузить контакты.'" />
    }
  `,
})
export class ContactsPageComponent {
  private readonly api = inject(PublicContentApiService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<ApiState<ContactSettings>>({ status: 'loading', data: null, error: null });
  protected readonly services = signal<ServiceSummary[]>([]);
  protected readonly consultationCopy: HomeSectionCopy['consultation'] = {
    eyebrow: 'Заявка на консультацию',
    title: 'Обсудим вашу задачу',
    description: 'Оставьте контакты, и мы свяжемся с вами, чтобы уточнить детали.',
    submitLabel: 'Отправить заявку',
    submittingLabel: 'Отправляем...',
    successRedirect: '/thank-you',
    consentText: 'Я согласен на обработку данных и ознакомлен с',
  };

  constructor() {
    this.seo.apply({
      title: 'Контакты | FinSky',
      description: 'Свяжитесь с FinSky для консультации по бухгалтерии, налогам и финансовым процессам бизнеса.',
      h1: 'Контакты FinSky',
    });

    this.api
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((services) => this.services.set(services));

    this.api
      .getContacts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (contacts) => this.state.set({ status: 'success', data: contacts, error: null }),
        error: () => this.state.set({ status: 'error', data: null, error: 'Контакты временно недоступны.' }),
      });
  }
}
