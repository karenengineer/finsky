import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-[80] grid place-items-center bg-navy/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div class="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-premium">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-premium-gold">Confirmation</p>
          <h2 class="mt-3 text-2xl font-bold text-navy">{{ title() }}</h2>
          <p class="mt-3 leading-7 text-premium-muted">{{ message() }}</p>
          <div class="mt-7 flex justify-end gap-3">
            <button type="button" class="rounded-full border border-premium-line px-5 py-3 text-sm font-bold text-navy" (click)="cancel.emit()">Cancel</button>
            <button type="button" class="rounded-full bg-red-700 px-5 py-3 text-sm font-bold text-white" (click)="confirm.emit()">Delete</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmModalComponent {
  readonly open = input(false);
  readonly title = input('Delete item?');
  readonly message = input('This action cannot be undone.');
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
