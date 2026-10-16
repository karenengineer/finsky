import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { MonthlyReportContent } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section id="monthly-report" class="border-y border-premium-line bg-white py-20 md:py-28">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-sky">{{ content().eyebrow }}</p>
          <h2 class="mt-5 max-w-xl font-display text-4xl font-extrabold leading-tight tracking-[-0.05em] text-premium-ink md:text-6xl">{{ content().title }}</h2>
          <p class="mt-6 max-w-lg text-lg leading-8 text-premium-muted">{{ content().description }}</p>
          <ul class="mt-9 space-y-4">
            @for (point of content().points; track point) {
              <li class="flex items-start gap-3 border-t border-premium-line pt-4 text-sm font-semibold text-premium-ink">
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-premium-gold" aria-hidden="true"></span>{{ point }}
              </li>
            }
          </ul>
        </div>
        <div class="overflow-hidden rounded-[2rem] border border-premium-line bg-premium-paper p-4 shadow-premium sm:p-6">
          <div class="rounded-[1.4rem] bg-white p-6 sm:p-8">
            <div class="flex flex-wrap items-start justify-between gap-4 border-b border-premium-line pb-6">
              <div>
                <span class="inline-block border border-sky px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-sky">{{ content().sampleLabel }}</span>
                <h3 class="mt-3 text-xl font-bold text-premium-ink">{{ content().periodLabel }}</h3>
              </div>
              <span class="font-mono text-sm font-bold tracking-[0.1em] text-sky">{{ 'common.brand' | translate }}</span>
            </div>
            <div class="mt-7 grid gap-0 sm:grid-cols-3">
              <div class="border-b border-premium-line pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
                <p class="text-xs font-semibold text-premium-muted">{{ content().revenueLabel }}</p>
                <p class="mt-3 font-mono text-xl font-semibold tabular-nums text-premium-ink sm:text-2xl">{{ content().revenueValue }}</p>
              </div>
              <div class="border-b border-premium-line py-5 sm:border-b-0 sm:border-r sm:px-4 sm:py-0">
                <p class="text-xs font-semibold text-premium-muted">{{ content().expensesLabel }}</p>
                <p class="mt-3 font-mono text-xl font-semibold tabular-nums text-premium-ink sm:text-2xl">{{ content().expensesValue }}</p>
              </div>
              <div class="pt-5 sm:pl-4 sm:pt-0">
                <p class="text-xs font-semibold text-premium-muted">{{ content().resultLabel }}</p>
                <p class="mt-3 font-mono text-xl font-semibold tabular-nums text-sky sm:text-2xl">{{ content().resultValue }}</p>
              </div>
            </div>
            <div class="mt-8 flex h-36 items-end gap-2 border-b border-premium-line pb-2" aria-hidden="true">
              @for (height of barHeights; track $index) {
                <span class="block flex-1 rounded-t-sm bg-sky/15" [style.height.%]="height"></span>
              }
            </div>
            <p class="mb-0 mt-5 text-xs leading-5 text-premium-muted">{{ content().note }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class MonthlyReportComponent {
  readonly content = input.required<MonthlyReportContent>();
  protected readonly barHeights = [34, 48, 42, 65, 72, 86];
}
