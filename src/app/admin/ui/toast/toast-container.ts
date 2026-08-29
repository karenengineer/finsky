import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="fixed right-4 top-4 z-[90] grid w-[min(calc(100%-2rem),380px)] gap-3">
      @for (toast of toastService.messages(); track toast.id) {
        <button
          type="button"
          class="rounded-2xl border bg-white p-4 text-left text-sm font-bold shadow-premium"
          [class.border-emerald-200]="toast.type === 'success'"
          [class.text-emerald-800]="toast.type === 'success'"
          [class.border-red-200]="toast.type === 'error'"
          [class.text-red-800]="toast.type === 'error'"
          [class.border-slate-200]="toast.type === 'info'"
          [class.text-navy]="toast.type === 'info'"
          (click)="toastService.dismiss(toast.id)"
        >
          {{ toast.message }}
        </button>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
