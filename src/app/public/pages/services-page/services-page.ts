import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { ApiState, ServiceSummary } from '../../../core/public-api/public-content.models';
import { SeoService } from '../../../core/seo/seo.service';
import { SectionStateComponent } from '../../components/section-state/section-state';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterLink, SectionStateComponent, TranslatePipe],
  template: `
    <section class="bg-premium-paper/70 py-20 md:py-28">
      <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ 'servicesPage.kicker' | translate }}</p>
        <h1 class="mt-4 max-w-4xl font-display text-5xl leading-tight tracking-[-0.04em] text-navy md:text-7xl">{{ 'servicesPage.title' | translate }}</h1>
        <p class="mt-7 max-w-3xl text-xl leading-9 text-premium-muted">{{ 'servicesPage.intro' | translate }}</p>
      </div>
    </section>

    @if (state().status === 'loading') {
      <app-section-state [label]="'public.states.loading' | translate" [message]="'public.states.loadingServices' | translate" />
    } @else if (state().data?.length) {
      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-5 md:grid-cols-2 lg:grid-cols-3">
          @for (service of state().data; track service.id) {
            <a [routerLink]="['/services', service.slug]" class="group rounded-premium border border-premium-line bg-white p-7 shadow-card transition hover:-translate-y-1 hover:shadow-premium">
              <span class="text-sm font-bold text-premium-gold">{{ service.order.toString().padStart(2, '0') }}</span>
              <h2 class="mt-8 text-2xl font-bold tracking-tight text-navy">{{ service.title }}</h2>
              <p class="mt-4 leading-7 text-premium-muted">{{ service.shortDescription }}</p>
              <span class="mt-8 inline-flex text-sm font-bold text-navy transition group-hover:text-premium-gold">{{ 'public.actions.openService' | translate }}</span>
            </a>
          }
        </div>
      </section>
    } @else if (state().status === 'error') {
      <app-section-state [label]="'public.states.error' | translate" [message]="state().error ?? ('public.states.servicesLoadError' | translate)" />
    } @else {
      <app-section-state [label]="'public.states.empty' | translate" [message]="'public.states.noServices' | translate" />
    }
  `,
})
export class ServicesPageComponent {
  private readonly api = inject(PublicContentApiService);
  private readonly localization = inject(LocalizationService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<ApiState<ServiceSummary[]>>({ status: 'loading', data: null, error: null });

  constructor() {
    effect(() => this.seo.apply({
      title: this.localization.translate('seo.services.title'),
      description: this.localization.translate('seo.services.description'),
      h1: this.localization.translate('servicesPage.title'),
    }));

    toObservable(this.localization.language)
      .pipe(
        switchMap(() => this.api.getServices()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (services) => this.state.set({ status: services.length ? 'success' : 'empty', data: services, error: null }),
        error: () => this.state.set({ status: 'error', data: null, error: this.localization.translate('public.states.servicesLoadError') }),
      });
  }
}
