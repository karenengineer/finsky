import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-admin-pagination',
  standalone: true,
  template: `
    <div class="flex items-center justify-between rounded-3xl border border-premium-line bg-white px-4 py-3 text-sm text-premium-muted">
      <span>Page {{ page() }} of {{ totalPages() }}</span>
      <div class="flex gap-2">
        <button type="button" class="rounded-full border border-premium-line px-4 py-2 font-bold text-navy disabled:opacity-40" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)">Prev</button>
        <button type="button" class="rounded-full border border-premium-line px-4 py-2 font-bold text-navy disabled:opacity-40" [disabled]="page() >= totalPages()" (click)="pageChange.emit(page() + 1)">Next</button>
      </div>
    </div>
  `,
})
export class AdminPaginationComponent {
  readonly page = input(1);
  readonly totalPages = input(1);
  readonly pageChange = output<number>();
}
