import { Component, input } from '@angular/core';
import { HomeSectionCopy, WorkStep } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-work-process',
  standalone: true,
  template: `
    <section id="process" class="bg-white py-20 md:py-28">
      <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ copy().eyebrow }}</p>
        <h2 class="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-navy md:text-6xl">
          {{ copy().title }}
        </h2>
        @if (copy().description) {
          <p class="mt-5 max-w-2xl leading-7 text-premium-muted">{{ copy().description }}</p>
        }
        <div class="mt-12 grid gap-4">
          @for (step of steps(); track step.id) {
            <article class="grid gap-5 rounded-premium border border-premium-line bg-white p-6 shadow-card md:grid-cols-[5rem_1fr] md:items-start">
              <div class="font-display text-4xl text-premium-gold">{{ step.order.toString().padStart(2, '0') }}</div>
              <div>
                <h3 class="text-2xl font-bold text-navy">{{ step.title }}</h3>
                <p class="mt-3 max-w-3xl leading-7 text-premium-muted">{{ step.description }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class WorkProcessComponent {
  readonly steps = input.required<WorkStep[]>();
  readonly copy = input.required<HomeSectionCopy['workProcess']>();
}
