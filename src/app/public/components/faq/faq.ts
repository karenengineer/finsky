import { Component, input, signal } from '@angular/core';
import { FaqItem, HomeSectionCopy } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-faq',
  standalone: true,
  template: `
    <section id="faq" class="bg-white py-20 md:py-28">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ copy().eyebrow }}</p>
          <h2 class="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-navy md:text-6xl">
            {{ copy().title }}
          </h2>
          @if (copy().description) {
            <p class="mt-5 leading-7 text-premium-muted">{{ copy().description }}</p>
          }
        </div>
        <div class="grid gap-3">
          @for (item of items(); track item.id) {
            <article class="rounded-3xl border border-premium-line bg-white shadow-card">
              <button type="button" class="flex w-full items-center justify-between gap-6 px-6 py-5 text-left" (click)="toggle(item.id)">
                <span class="text-lg font-bold text-navy">{{ item.question }}</span>
                <span class="grid size-9 shrink-0 place-items-center rounded-full bg-premium-paper text-xl text-navy">
                  {{ openItemId() === item.id ? '−' : '+' }}
                </span>
              </button>
              @if (openItemId() === item.id) {
                <p class="px-6 pb-6 leading-7 text-premium-muted">{{ item.answer }}</p>
              }
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class FaqComponent {
  readonly items = input.required<FaqItem[]>();
  readonly copy = input.required<HomeSectionCopy['faq']>();
  protected readonly openItemId = signal<string | null>(null);

  protected toggle(id: string): void {
    this.openItemId.update((current) => (current === id ? null : id));
  }
}
