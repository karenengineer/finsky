import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-thank-you-page',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="grid min-h-[62vh] place-items-center bg-premium-paper/70 px-4 py-20 text-center">
      <div class="max-w-2xl rounded-[2rem] bg-white p-8 shadow-premium md:p-12">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ 'contactsPage.kicker' | translate }}</p>
        <h1 class="mt-4 font-display text-5xl leading-tight tracking-[-0.04em] text-navy">{{ 'public.form.openEmail' | translate }}</h1>
        <p class="mt-5 text-lg leading-8 text-premium-muted">{{ 'public.form.emailNotice' | translate }}</p>
        <a routerLink="/" class="mt-8 inline-flex min-h-12 items-center rounded-full bg-navy px-6 text-sm font-bold text-white transition hover:bg-navy-700">{{ 'successPage.back' | translate }}</a>
      </div>
    </section>
  `,
})
export class ThankYouPageComponent {
  private readonly seo = inject(SeoService);
  private readonly localization = inject(LocalizationService);

  constructor() {
    effect(() => this.seo.apply({
      title: this.localization.translate('seo.thankYou.title'),
      description: this.localization.translate('seo.thankYou.description'),
    }));
  }
}
