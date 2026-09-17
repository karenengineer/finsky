import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { HeroContent } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="relative overflow-hidden bg-white">
      <div class="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-navy-50 to-transparent"></div>
      <div class="relative mx-auto grid min-h-[760px] w-[min(calc(100%-2rem),1200px)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p class="mb-6 inline-flex rounded-full border border-premium-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-premium-gold shadow-card">
            {{ content().eyebrow }}
          </p>
          <h1 class="font-display text-5xl leading-[1.04] tracking-[-0.04em] text-navy md:text-7xl">
            {{ content().title }}
          </h1>
          <p class="mt-7 max-w-2xl text-lg leading-8 text-premium-muted">
            {{ content().description }}
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <a [href]="content().primaryCtaHref" class="inline-flex min-h-14 items-center justify-center rounded-full bg-navy px-7 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-navy-700">
              {{ content().primaryCtaLabel }}
            </a>
            <a [routerLink]="content().secondaryCtaHref" class="inline-flex min-h-14 items-center justify-center rounded-full border border-navy px-7 text-sm font-bold text-navy transition hover:-translate-y-1 hover:bg-navy hover:text-white">
              {{ content().secondaryCtaLabel }}
            </a>
          </div>
          <div class="mt-9 flex flex-wrap gap-3">
            @for (highlight of content().highlights; track highlight) {
              <span class="rounded-full bg-premium-paper px-4 py-2 text-sm font-semibold text-navy">{{ highlight }}</span>
            }
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-6 rounded-[2.5rem] bg-navy/5"></div>
          <div class="relative overflow-hidden rounded-[2rem] bg-navy p-7 text-white shadow-premium">
            <div
              class="aspect-[4/5] rounded-[1.5rem] bg-cover bg-center"
              role="img"
              [attr.aria-label]="content().imageAlt"
              [style.background-image]="'linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.03)), url(' + content().imageUrl + ')'"
            ></div>
            <div class="mt-7 grid gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/15 bg-white/10 p-4">
                <span class="block text-2xl font-bold">{{ 'common.heroNumbers.accounting' | translate }}</span>
                <span class="mt-1 block text-xs text-white/70">{{ 'public.hero.accounting' | translate }}</span>
              </div>
              <div class="rounded-2xl border border-white/15 bg-white/10 p-4">
                <span class="block text-2xl font-bold">{{ 'common.heroNumbers.taxes' | translate }}</span>
                <span class="mt-1 block text-xs text-white/70">{{ 'public.hero.taxes' | translate }}</span>
              </div>
              <div class="rounded-2xl border border-white/15 bg-white/10 p-4">
                <span class="block text-2xl font-bold">{{ 'common.heroNumbers.reporting' | translate }}</span>
                <span class="mt-1 block text-xs text-white/70">{{ 'public.hero.reporting' | translate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly content = input.required<HeroContent>();
}
