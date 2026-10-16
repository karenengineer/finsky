import { Component, input } from '@angular/core';
import { Benefit, HomeSectionCopy } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-benefits',
  standalone: true,
  template: `
    <section class="bg-premium-paper py-20 md:py-28">
      <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ copy().eyebrow }}</p>
        <div class="mt-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <h2 class="font-display text-4xl leading-tight tracking-[-0.04em] text-navy md:text-6xl">
            {{ copy().title }}
          </h2>
          <div class="grid border-t border-premium-line sm:grid-cols-2">
            @for (benefit of benefits(); track benefit.id) {
              <article class="border-b border-premium-line p-6 sm:odd:border-r">
                <div class="mb-6 h-1 w-9 bg-premium-gold" aria-hidden="true"></div>
                <h3 class="text-xl font-bold text-navy">{{ benefit.title }}</h3>
                <p class="mt-3 leading-7 text-premium-muted">{{ benefit.description }}</p>
              </article>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BenefitsComponent {
  readonly benefits = input.required<Benefit[]>();
  readonly copy = input.required<HomeSectionCopy['benefits']>();
}
