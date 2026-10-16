import { Component, computed, input, signal } from '@angular/core';
import { ComplexityInstrumentContent } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-complexity-instrument',
  standalone: true,
  template: `
    <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e1642] p-5 text-white shadow-[0_32px_80px_rgba(3,33,58,.2)] sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-white/55">{{ content().eyebrow }}</p>
      @if (level(); as current) {
        <div class="mt-7 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <div class="min-h-48 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">{{ content().inputLabel }}</p>
            <div class="mt-7 grid gap-3" aria-hidden="true">
              @for (line of lineIndexes(); track line) {
                <span
                  class="block h-1.5 rounded-full bg-white/25 transition-[width,transform] duration-500"
                  [style.width.%]="33 + ((line * 23) % 61)"
                  [style.transform]="'translateX(' + (((line % 3) - 1) * (selectedIndex() + 1) * 4) + 'px)'"
                ></span>
              }
            </div>
          </div>
          <div class="flex items-center justify-center text-2xl text-[#f59e2b]" aria-hidden="true">→</div>
          <div class="flex min-h-48 flex-col rounded-2xl border border-white/10 bg-white/5 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">{{ content().outputLabel }}</p>
            <div class="my-auto flex items-center gap-2" aria-hidden="true">
              <span class="size-2.5 shrink-0 rounded-full bg-[#f59e2b]"></span>
              <span class="h-0.5 w-full bg-[#f59e2b]"></span>
              <span class="size-2.5 shrink-0 rounded-full bg-[#f59e2b]"></span>
            </div>
            <p class="text-sm font-semibold leading-6 text-white">{{ content().result }}</p>
          </div>
        </div>
        <div class="mt-8">
          <div class="flex items-baseline justify-between gap-4">
            <label for="complexity-range" class="text-sm font-semibold text-white/70">{{ content().sliderLabel }}</label>
            <span class="font-mono text-sm tabular-nums text-[#f59e2b]">0{{ selectedIndex() + 1 }} / 0{{ content().levels.length }}</span>
          </div>
          <input
            id="complexity-range"
            type="range"
            min="1"
            [max]="content().levels.length"
            step="1"
            [value]="selectedIndex() + 1"
            [attr.aria-valuetext]="current.title"
            class="mt-5 w-full cursor-pointer accent-[#f59e2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e2b]"
            (input)="selectLevel($event)"
          />
          <div class="mt-5 border-t border-white/10 pt-5" aria-live="polite">
            <h2 class="text-xl font-bold leading-tight">{{ current.title }}</h2>
            <p class="mt-2 text-sm leading-6 text-white/65">{{ current.description }}</p>
            <span class="mt-4 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/85">{{ current.deliverable }}</span>
          </div>
        </div>
      }
    </div>
  `,
})
export class ComplexityInstrumentComponent {
  readonly content = input.required<ComplexityInstrumentContent>();
  protected readonly selectedIndex = signal(0);
  protected readonly level = computed(() => this.content().levels[this.selectedIndex()]);
  protected readonly lineIndexes = computed(() => Array.from({ length: 4 + this.selectedIndex() * 2 }, (_, index) => index));

  protected selectLevel(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.selectedIndex.set(Math.max(0, Math.min(this.content().levels.length - 1, value - 1)));
  }
}
