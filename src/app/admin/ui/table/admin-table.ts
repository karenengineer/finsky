import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  template: `
    <div class="overflow-hidden rounded-[1.5rem] border border-premium-line bg-white shadow-card">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-left text-sm">
          <ng-content />
        </table>
      </div>
    </div>
  `,
})
export class AdminTableComponent {}
