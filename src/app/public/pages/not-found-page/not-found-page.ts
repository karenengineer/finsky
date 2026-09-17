import { Component, effect, inject } from '@angular/core';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-public-not-found-page',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="grid min-h-[62vh] place-items-center bg-white px-4 py-20 text-center">
      <div class="max-w-2xl">
        <p class="font-display text-8xl text-premium-gold">{{ 'notFoundPage.code' | translate }}</p>
        <h1 class="mt-4 font-display text-5xl tracking-[-0.04em] text-navy">{{ 'notFoundPage.title' | translate }}</h1>
        <p class="mt-5 text-lg leading-8 text-premium-muted">{{ 'notFoundPage.text' | translate }}</p>
        <a routerLink="/" class="mt-8 inline-flex min-h-12 items-center rounded-full bg-navy px-6 text-sm font-bold text-white transition hover:bg-navy-700">{{ 'common.actions.backHome' | translate }}</a>
      </div>
    </section>
  `,
})
export class NotFoundPageComponent {
  private readonly seo = inject(SeoService);
  private readonly localization = inject(LocalizationService);

  constructor() {
    effect(() => this.seo.apply({
      title: this.localization.translate('seo.notFound.title'),
      description: this.localization.translate('seo.notFound.description'),
    }));
  }
}
