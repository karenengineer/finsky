import { Component, input } from '@angular/core';

@Component({
  selector: 'app-admin-empty-state',
  standalone: true,
  template: `
    <div class="rounded-[1.5rem] border border-dashed border-premium-line bg-white p-10 text-center">
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-premium-gold">{{ label() }}</p>
      <p class="mt-3 text-lg font-bold text-navy">{{ message() }}</p>
    </div>
  `,
})
export class AdminEmptyStateComponent {
  readonly label = input('Empty');
  readonly message = input.required<string>();
}
