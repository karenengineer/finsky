import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-state',
  standalone: true,
  template: `
    <div class="mx-auto w-[min(calc(100%-2rem),1200px)] py-20">
      <div class="rounded-premium border border-premium-line bg-white p-8 text-center shadow-card">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-premium-gold">{{ label() }}</p>
        <p class="mt-3 text-lg font-semibold text-navy">{{ message() }}</p>
      </div>
    </div>
  `,
})
export class SectionStateComponent {
  readonly label = input.required<string>();
  readonly message = input.required<string>();
}
