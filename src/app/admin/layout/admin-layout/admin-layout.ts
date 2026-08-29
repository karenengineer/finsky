import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastContainerComponent } from '../../ui/toast/toast-container';

interface AdminNavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ToastContainerComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-premium-ink lg:grid lg:grid-cols-[280px_1fr]">
      <aside class="border-r border-premium-line bg-navy text-white lg:min-h-screen">
        <div class="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <a routerLink="/admin/dashboard" class="flex items-center gap-3">
            <span class="grid size-11 place-items-center rounded-2xl bg-white text-lg font-bold text-navy">F</span>
            <span>
              <span class="block text-lg font-bold">FinSky</span>
              <span class="block text-xs uppercase tracking-[0.18em] text-white/55">Admin panel</span>
            </span>
          </a>
        </div>
        <nav class="grid gap-1 p-4 text-sm font-semibold">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-white/10 text-white"
              class="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <span class="w-5 text-center">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>
      </aside>

      <section class="min-w-0">
        <header class="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-premium-line bg-white/90 px-5 backdrop-blur-xl lg:px-8">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-premium-gold">Workspace</p>
            <h1 class="text-xl font-bold text-navy">Управление сайтом</h1>
          </div>
          <div class="flex items-center gap-3">
            <a routerLink="/" target="_blank" class="hidden rounded-full border border-premium-line px-4 py-2 text-sm font-bold text-navy md:inline-flex">Открыть сайт</a>
            <div class="hidden text-right md:block">
              <div class="text-sm font-bold text-navy">{{ displayName() }}</div>
              <div class="text-xs text-premium-muted">{{ auth.currentUser()?.role ?? 'ADMIN' }}</div>
            </div>
            <button type="button" class="grid size-11 place-items-center rounded-full bg-navy text-sm font-bold text-white" (click)="logout()">
              {{ initials() }}
            </button>
          </div>
        </header>

        <main class="p-5 lg:p-8">
          <router-outlet />
        </main>
      </section>

      <app-toast-container />
    </div>
  `,
})
export class AdminLayoutComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navItems: AdminNavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '⌂' },
    { label: 'Pages', path: '/admin/pages', icon: '≡' },
    { label: 'Services', path: '/admin/services', icon: '◇' },
    { label: 'Benefits', path: '/admin/benefits', icon: '✓' },
    { label: 'Statistics', path: '/admin/statistics', icon: '#' },
    { label: 'Work steps', path: '/admin/work-steps', icon: '→' },
    { label: 'Testimonials', path: '/admin/testimonials', icon: '”' },
    { label: 'FAQ', path: '/admin/faq', icon: '?' },
    { label: 'Requests', path: '/admin/requests', icon: '□' },
    { label: 'Contacts', path: '/admin/contacts', icon: '@' },
    { label: 'Localizations', path: '/admin/localizations', icon: '文' },
    { label: 'SEO', path: '/admin/seo', icon: '◎' },
    { label: 'Media', path: '/admin/media', icon: '▧' },
  ];

  protected readonly displayName = computed(() => {
    const user = this.auth.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'Preview Admin';
  });

  protected readonly initials = computed(() => {
    const user = this.auth.currentUser();
    return user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` : 'PA';
  });

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/admin/login');
  }
}
