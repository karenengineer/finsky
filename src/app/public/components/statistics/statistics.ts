import { Component, input } from '@angular/core';
import { Statistic } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  template: `
    <section class="bg-navy py-14 text-white">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-4 md:grid-cols-3">
        @for (stat of statistics(); track stat.id) {
          <div class="rounded-premium border border-white/10 bg-white/5 p-7">
            <div class="font-display text-4xl text-white md:text-5xl">{{ stat.value }}</div>
            <p class="mt-3 text-sm leading-6 text-white/70">{{ stat.label }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class StatisticsComponent {
  readonly statistics = input.required<Statistic[]>();
}
