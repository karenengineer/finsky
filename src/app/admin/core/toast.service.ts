import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);

  show(message: string, type: ToastType = 'success'): void {
    const toast = { id: crypto.randomUUID(), type, message };
    this.messages.update((items) => [...items, toast]);
    window.setTimeout(() => this.dismiss(toast.id), 3200);
  }

  dismiss(id: string): void {
    this.messages.update((items) => items.filter((item) => item.id !== id));
  }
}
