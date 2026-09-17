import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { ApiState, HomeSectionCopy, ServiceDetail } from '../../../core/public-api/public-content.models';
import { SeoService } from '../../../core/seo/seo.service';
import { ConsultationFormComponent } from '../../components/consultation-form/consultation-form';
import { SectionStateComponent } from '../../components/section-state/section-state';

@Component({
  selector: 'app-service-detail-page',
  standalone: true,
  imports: [ConsultationFormComponent, RouterLink, SectionStateComponent, TranslatePipe],
  template: `
    @if (state().status === 'loading') {
      <app-section-state [label]="'public.states.loading' | translate" [message]="'public.states.loadingService' | translate" />
    } @else if (state().data; as service) {
      <section class="bg-premium-paper/70 py-20 md:py-28">
        <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
          <a routerLink="/services" class="text-sm font-bold text-premium-gold">← {{ 'common.actions.allServices' | translate }}</a>
          <h1 class="mt-6 max-w-4xl font-display text-5xl leading-tight tracking-[-0.04em] text-navy md:text-7xl">{{ service.seo.h1 || service.title }}</h1>
          <p class="mt-7 max-w-3xl text-xl leading-9 text-premium-muted">{{ service.fullDescription }}</p>
        </div>
      </section>
      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ 'serviceDetail.included' | translate }}</p>
            <h2 class="mt-4 font-display text-4xl tracking-[-0.04em] text-navy">{{ 'serviceDetail.heading' | translate }}</h2>
          </div>
          <div class="grid gap-4">
            @for (item of service.includes; track item) {
              <div class="rounded-3xl border border-premium-line bg-white p-6 shadow-card">
                <span class="font-bold text-navy">{{ item }}</span>
              </div>
            }
          </div>
        </div>
      </section>
      <app-consultation-form [services]="[service]" [copy]="consultationCopy()" />
    } @else {
      <app-section-state [label]="'public.states.notFound' | translate" [message]="'public.states.serviceNotFound' | translate" />
    }
  `,
})
export class ServiceDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PublicContentApiService);
  private readonly localization = inject(LocalizationService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<ApiState<ServiceDetail>>({ status: 'loading', data: null, error: null });
  protected readonly consultationCopy = signal<HomeSectionCopy['consultation']>(this.buildConsultationCopy());

  constructor() {
    combineLatest([this.route.paramMap, toObservable(this.localization.language)])
      .pipe(
        switchMap(([params]) => {
          this.state.set({ status: 'loading', data: null, error: null });
          this.consultationCopy.set(this.buildConsultationCopy());
          return this.api.getServiceBySlug(params.get('slug') ?? '');
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (service) => {
          if (service) {
            this.seo.apply(service.seo);
          } else {
            this.seo.apply({
              title: this.localization.translate('seo.notFound.title'),
              description: this.localization.translate('public.states.serviceNotFound'),
            });
          }
          this.state.set({ status: service ? 'success' : 'empty', data: service, error: null });
        },
        error: () => this.state.set({ status: 'error', data: null, error: this.localization.translate('public.states.serviceLoadError') }),
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
