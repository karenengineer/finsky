import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroContent } from '../../../core/public-api/public-content.models';
import { ComplexityInstrumentComponent } from '../complexity-instrument/complexity-instrument';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, ComplexityInstrumentComponent],
  template: `
    <section class="relative overflow-hidden bg-premium-paper">
      <div class="relative mx-auto grid min-h-[700px] w-[min(calc(100%-2rem),1200px)] items-center gap-12 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
        <div>
          <p class="mb-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-premium-muted before:block before:h-px before:w-8 before:bg-premium-gold">
            {{ content().eyebrow }}
          </p>
          <h1 class="font-display text-[clamp(1.8rem,7.8vw,2.25rem)] font-extrabold leading-[1.13] tracking-[-0.045em] text-premium-ink [overflow-wrap:anywhere] sm:text-[clamp(2.25rem,3.8vw,4.25rem)]">
            {{ content().title }}<br /><span class="text-sky">{{ content().titleAccent }}</span>
          </h1>
          <p class="mt-8 max-w-xl text-lg leading-8 text-premium-muted">
            {{ content().description }}
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <a [href]="content().primaryCtaHref" class="inline-flex min-h-14 items-center justify-center bg-sky px-7 text-sm font-bold text-white transition-colors hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky">
              {{ content().primaryCtaLabel }}
            </a>
            <a [routerLink]="content().secondaryCtaHref" class="inline-flex min-h-14 items-center justify-center border border-premium-ink px-7 text-sm font-bold text-premium-ink transition-colors hover:bg-premium-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky">
              {{ content().secondaryCtaLabel }}
            </a>
          </div>
          <div class="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-premium-line pt-6">
            @for (highlight of content().highlights; track highlight) {
              <span class="inline-flex items-center gap-2 text-xs font-semibold text-premium-ink before:block before:size-1.5 before:rounded-full before:bg-premium-gold">{{ highlight }}</span>
            }
          </div>
        </div>
        <app-complexity-instrument [content]="content().instrument" />
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly content = input.required<HeroContent>();
}
