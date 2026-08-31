import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { ApiState, PublicHomeContent } from '../../../core/public-api/public-content.models';
import { SeoService } from '../../../core/seo/seo.service';
import { AboutPreviewComponent } from '../../components/about-preview/about-preview';
import { BenefitsComponent } from '../../components/benefits/benefits';
import { ConsultationFormComponent } from '../../components/consultation-form/consultation-form';
import { FaqComponent } from '../../components/faq/faq';
import { HeroComponent } from '../../components/hero/hero';
import { SectionStateComponent } from '../../components/section-state/section-state';
import { ServicesPreviewComponent } from '../../components/services-preview/services-preview';
import { StatisticsComponent } from '../../components/statistics/statistics';
import { TestimonialsComponent } from '../../components/testimonials/testimonials';
import { WorkProcessComponent } from '../../components/work-process/work-process';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    AboutPreviewComponent,
    BenefitsComponent,
    ConsultationFormComponent,
    FaqComponent,
    HeroComponent,
    SectionStateComponent,
    ServicesPreviewComponent,
    StatisticsComponent,
    TestimonialsComponent,
    WorkProcessComponent,
    TranslatePipe,
  ],
  template: `
    @switch (state().status) {
      @case ('loading') {
        <app-section-state [label]="'public.states.loading' | translate" [message]="'public.states.loadingHome' | translate" />
      }
      @case ('error') {
        <app-section-state [label]="'public.states.error' | translate" [message]="state().error ?? ('public.states.homeLoadError' | translate)" />
      }
      @case ('empty') {
        <app-section-state [label]="'public.states.empty' | translate" [message]="'public.states.homeEmpty' | translate" />
      }
      @case ('success') {
        @if (state().data; as content) {
          <app-hero [content]="content.hero" />
          <app-services-preview [services]="content.services" [copy]="content.sections.services" />
          <app-benefits [benefits]="content.benefits" [copy]="content.sections.benefits" />
          <app-about-preview [about]="content.about" [team]="content.team" />
          <app-statistics [statistics]="content.statistics" />
          <app-work-process [steps]="content.workSteps" [copy]="content.sections.workProcess" />
          <app-testimonials [testimonials]="content.testimonials" [copy]="content.sections.testimonials" />
          <app-faq [items]="content.faq" [copy]="content.sections.faq" />
          <app-consultation-form [services]="content.services" [copy]="content.sections.consultation" />
        }
      }
    }
  `,
})
export class HomePageComponent {
  private readonly api = inject(PublicContentApiService);
  private readonly localization = inject(LocalizationService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<ApiState<PublicHomeContent>>({
    status: 'loading',
    data: null,
    error: null,
  });

  constructor() {
    toObservable(this.localization.language)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        switchMap(() => {
          this.state.set({ status: 'loading', data: null, error: null });
          return this.api.getHome();
        }),
      )
      .subscribe({
        next: (content) => {
          this.seo.apply(content.seo);
          this.state.set({
            status: content ? 'success' : 'empty',
            data: content,
            error: null,
          });
        },
        error: () => {
          this.state.set({
            status: 'error',
            data: null,
          error: this.localization.translate('public.states.homeLoadError'),
          });
        },
      });
  }
}
