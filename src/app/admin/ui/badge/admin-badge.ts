import { Component, input } from '@angular/core';
import { PublishStatus, RequestStatus } from '../../core/admin.models';

@Component({
  selector: 'app-admin-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]"
      [class.bg-emerald-50]="tone() === 'green'"
      [class.text-emerald-700]="tone() === 'green'"
      [class.bg-amber-50]="tone() === 'amber'"
      [class.text-amber-700]="tone() === 'amber'"
      [class.bg-red-50]="tone() === 'red'"
      [class.text-red-700]="tone() === 'red'"
      [class.bg-slate-100]="tone() === 'slate'"
      [class.text-slate-700]="tone() === 'slate'"
    >
      {{ label() }}
    </span>
  `,
})
export class AdminBadgeComponent {
  readonly value = input.required<PublishStatus | RequestStatus>();

  protected label(): string {
    const labels: Record<PublishStatus | RequestStatus, string> = {
      PUBLISHED: 'Published',
      HIDDEN: 'Hidden',
      NEW: 'New',
      IN_PROGRESS: 'In progress',
      COMPLETED: 'Completed',
      REJECTED: 'Rejected',
    };
    return labels[this.value()];
  }

  protected tone(): 'green' | 'amber' | 'red' | 'slate' {
    const value = this.value();
    if (value === 'PUBLISHED' || value === 'COMPLETED') {
      return 'green';
    }
    if (value === 'NEW' || value === 'IN_PROGRESS') {
      return 'amber';
    }
    if (value === 'REJECTED') {
      return 'red';
    }
    return 'slate';
  }
}
