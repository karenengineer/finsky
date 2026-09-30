import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap } from 'rxjs';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { ApiState, ContactSettings, HomeSectionCopy, ServiceSummary } from '../../../core/public-api/public-content.models';
import { SeoService } from '../../../core/seo/seo.service';
import { ConsultationFormComponent } from '../../components/consultation-form/consultation-form';
import { SectionStateComponent } from '../../components/section-state/section-state';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [ConsultationFormComponent, SectionStateComponent, TranslatePipe],
  template: `
    @if (state().status === 'loading') {
      <app-section-state [label]="'public.states.loading' | translate" [message]="'public.states.loadingContacts' | translate" />
    } @else if (state().data; as contacts) {
      <section class="bg-premium-paper/70 py-20 md:py-28">
        <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ 'contactsPage.kicker' | translate }}</p>
          <h1 class="mt-4 max-w-4xl font-display text-5xl leading-tight tracking-[-0.04em] text-navy md:text-7xl">{{ contacts.title }}</h1>
          <p class="mt-7 max-w-3xl text-xl leading-9 text-premium-muted">{{ contacts.description }}</p>
        </div>
      </section>
      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-5 md:grid-cols-2 lg:grid-cols-4">
          @if (contacts.phone) {
            <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">{{ 'common.contact.phoneLabel' | translate }}</b><p class="mt-3 text-premium-muted">{{ contacts.phone }}</p></div>
          }
          <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">{{ 'common.contact.emailLabel' | translate }}</b><p class="mt-3 text-premium-muted">{{ contacts.email }}</p></div>
          <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">{{ 'common.contact.officeLabel' | translate }}</b><p class="mt-3 text-premium-muted">{{ contacts.address }}</p></div>
          <div class="rounded-premium border border-premium-line p-6 shadow-card"><b class="text-navy">{{ 'common.contact.hoursLabel' | translate }}</b><p class="mt-3 text-premium-muted">{{ contacts.workingHours }}</p></div>
        </div>
      </section>
      <app-consultation-form [services]="services()" [copy]="consultationCopy()" />
    } @else {
      <app-section-state [label]="'public.states.error' | translate" [message]="state().error ?? ('public.states.contactsLoadError' | translate)" />
    }
  `,
})
export class ContactsPageComponent {
  private readonly api = inject(PublicContentApiService);
  private readonly localization = inject(LocalizationService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<ApiState<ContactSettings>>({ status: 'loading', data: null, error: null });
  protected readonly services = signal<ServiceSummary[]>([]);
  protected readonly consultationCopy = signal<HomeSectionCopy['consultation']>(this.buildConsultationCopy());

  constructor() {
    toObservable(this.localization.language)
      .pipe(
        switchMap(() => {
          this.state.set({ status: 'loading', data: null, error: null });
          this.consultationCopy.set(this.buildConsultationCopy());
          return forkJoin({
            services: this.api.getServices(),
            contacts: this.api.getContacts(),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ services, contacts }) => {
          this.seo.apply(contacts.seo);
          this.services.set(services);
          this.state.set({ status: 'success', data: contacts, error: null });
        },
        error: () => this.state.set({ status: 'error', data: null, error: this.localization.translate('public.states.contactsLoadError') }),
      });
  }

  private buildConsultationCopy(): HomeSectionCopy['consultation'] {
    return {
      eyebrow: this.localization.translate('home.consultation.kicker'),
      title: this.localization.translate('home.consultation.title'),
      description: this.localization.translate('public.form.emailDescription'),
      submitLabel: this.localization.translate('public.form.openEmail'),
      consentText: this.localization.translate('public.form.consentPrefix'),
    };
  }
}
