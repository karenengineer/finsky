import { Component, input } from '@angular/core';

@Component({
  selector: 'app-admin-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      class="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55"
      [class.bg-navy]="variant() === 'primary'"
      [class.text-white]="variant() === 'primary'"
      [class.hover\\:bg-navy-700]="variant() === 'primary'"
      [class.border]="variant() !== 'primary'"
      [class.border-premium-line]="variant() !== 'primary'"
      [class.bg-white]="variant() !== 'primary'"
      [class.text-navy]="variant() !== 'primary'"
      [class.hover\\:border-navy]="variant() !== 'primary'"
    >
      <ng-content />
    </button>
  `,
})
export class AdminButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'secondary' | 'danger'>('primary');
  readonly disabled = input(false);
}
