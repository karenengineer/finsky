import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { AboutPreview, TeamTrustSection } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-about-preview',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="bg-premium-paper py-20 md:py-28">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ about().eyebrow }}</p>
          <h2 class="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-navy md:text-6xl">
            {{ about().title }}
          </h2>
          <p class="mt-6 text-lg leading-8 text-premium-muted">{{ about().description }}</p>
          <a [routerLink]="about().ctaHref" class="mt-8 inline-flex min-h-12 items-center rounded-full bg-navy px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-700">
            {{ about().ctaLabel }}
          </a>
        </div>
        <div class="relative overflow-hidden bg-[#0e1642] p-8 text-white sm:p-12">
          <div class="absolute -right-16 -top-16 size-72 rounded-full border border-white/10" aria-hidden="true"></div>
          <div class="absolute -right-5 -top-5 size-52 rounded-full border border-white/10" aria-hidden="true"></div>
          <div class="relative font-mono text-sm font-bold tracking-[0.2em] text-premium-gold">{{ 'common.brand' | translate }}</div>
          <div class="relative mt-24 border-t border-white/20 pt-6">
            @for (point of team().trustPoints; track point) {
              <p class="mb-0 border-b border-white/15 py-4 text-xl font-semibold leading-snug text-white">{{ point }}</p>
            }
          </div>
        </div>
      </div>

      @if (team().isVisible) {
        <div class="mx-auto mt-16 w-[min(calc(100%-2rem),1200px)] overflow-hidden rounded-[2rem] shadow-premium">
          <section
            class="relative bg-cover bg-center px-6 py-20 md:px-12 md:py-28"
          >
            <div class="absolute inset-0 bg-cover bg-center" role="img" [attr.aria-label]="team().backgroundImageAlt" [style.background-image]="'url(' + team().backgroundImageUrl + ')'"></div>
            <div class="absolute inset-0 bg-navy" [style.opacity]="team().overlayOpacity"></div>
            <div class="relative max-w-3xl text-white">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ team().label }}</p>
              <h3 class="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] md:text-6xl">{{ team().title }}</h3>
              <p class="mt-6 text-lg leading-8 text-white/80">{{ team().description }}</p>
              <div class="mt-8 flex flex-wrap gap-3">
                @for (point of team().trustPoints; track point) {
                  <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">{{ point }}</span>
                }
              </div>
              <a [routerLink]="team().ctaLink" class="mt-9 inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:bg-premium-paper">
                {{ team().ctaText }}
              </a>
            </div>
          </section>
        </div>
      }
    </section>
  `,
})
export class AboutPreviewComponent {
  readonly about = input.required<AboutPreview>();
  readonly team = input.required<TeamTrustSection>();
}
