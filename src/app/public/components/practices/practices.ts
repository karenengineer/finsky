import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PracticesContent } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-practices',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section id="practices" class="bg-white py-20 md:py-28">
      <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-sky">{{ content().eyebrow }}</p>
        <div class="mt-4 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <h2 class="font-display text-4xl font-extrabold leading-tight tracking-[-0.05em] text-premium-ink md:text-6xl">{{ content().title }}</h2>
          <p class="max-w-xl text-lg leading-8 text-premium-muted">{{ content().description }}</p>
        </div>
        <div class="mt-12 grid gap-4 md:grid-cols-2">
          @for (card of content().cards; track card.id; let first = $first) {
            <article class="flex flex-col border border-premium-line p-7 sm:p-10" [class.bg-premium-paper]="first" [class.bg-[#0e1642]]="!first" [class.text-white]="!first">
              <span class="font-mono text-4xl font-bold" [class.text-sky]="first" [class.text-premium-gold]="!first" aria-hidden="true">{{ card.symbol }}</span>
              <h3 class="mt-10 text-3xl font-bold tracking-tight">{{ card.title }}</h3>
              <p class="mt-4 max-w-lg leading-7" [class.text-premium-muted]="first" [class.text-white/70]="!first">{{ card.description }}</p>
              <ul class="mt-7 space-y-3 border-t pt-6 text-sm font-semibold" [class.border-premium-line]="first" [class.border-white/20]="!first">
                @for (point of card.points; track point) {
                  <li class="flex items-start gap-3"><span class="mt-2 size-1.5 shrink-0 rounded-full bg-premium-gold" aria-hidden="true"></span>{{ point }}</li>
                }
              </ul>
              <a [routerLink]="card.ctaHref" class="mt-10 inline-flex min-h-12 items-center self-start border-b-2 pb-1 text-sm font-bold transition-colors" [class.border-sky]="first" [class.text-sky]="first" [class.border-premium-gold]="!first" [class.text-white]="!first">
                {{ card.ctaLabel }} →
              </a>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class PracticesComponent {
  readonly content = input.required<PracticesContent>();
}
