import { Component, inject, input } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  template: `
    <label class="grid gap-2">
      <span class="text-sm font-bold text-navy">{{ label() }}</span>
      <textarea
        class="min-h-32 rounded-2xl border border-premium-line bg-white px-4 py-3 text-sm outline-none transition focus:border-premium-gold focus:ring-4 focus:ring-premium-gold/10"
        [placeholder]="placeholder()"
        [formControlName]="controlName()"
      ></textarea>
      @if (error()) {
        <span class="text-sm font-semibold text-red-700">{{ error() }}</span>
      }
    </label>
  `,
})
export class AdminTextareaComponent {
  readonly label = input.required<string>();
  readonly controlName = input.required<string>();
  readonly placeholder = input('');
  readonly error = input<string | null>(null);
}
