import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { HomeSectionCopy, Testimonial } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section class="bg-premium-paper/70 py-20 md:py-28">
      <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ copy().eyebrow }}</p>
        <h2 class="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-navy md:text-6xl">
          {{ copy().title }}
        </h2>
        <div class="mt-10 grid gap-5 md:grid-cols-2">
          @for (testimonial of testimonials(); track testimonial.id) {
            <article class="rounded-premium border border-premium-line bg-white p-7 shadow-card">
              @if (testimonial.isDemo) {
                <span class="rounded-full bg-premium-paper px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-premium-gold">{{ 'public.testimonials.demoBadge' | translate }}</span>
              }
              <p class="mt-5 text-lg leading-8 text-premium-ink">“{{ testimonial.text }}”</p>
              <div class="mt-7 border-t border-premium-line pt-5">
                <div class="font-bold text-navy">{{ testimonial.authorName }}</div>
                <div class="mt-1 text-sm text-premium-muted">{{ testimonial.authorRole }}</div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsComponent {
  readonly testimonials = input.required<Testimonial[]>();
  readonly copy = input.required<HomeSectionCopy['testimonials']>();
}
