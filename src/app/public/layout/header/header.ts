import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../../shared/language-switcher/language-switcher';

interface NavItem {
  labelKey: string;
  href: string;
  fragment?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageSwitcherComponent, TranslatePipe],
  template: `
    <header class="sticky top-0 z-50 border-b border-premium-line/80 bg-white/90 backdrop-blur-xl">
      <div class="mx-auto flex h-20 w-[min(calc(100%-2rem),1200px)] items-center justify-between">
        <a routerLink="/" class="group flex items-center gap-3" aria-label="FinSky home">
          <span class="grid size-11 place-items-center rounded-2xl bg-navy text-lg font-bold text-white shadow-card">F</span>
          <span>
            <span class="block text-lg font-bold tracking-tight text-navy">FinSky</span>
            <span class="block text-xs font-semibold uppercase tracking-[0.22em] text-premium-gold">Accounting consulting</span>
          </span>
        </a>

        <nav class="hidden items-center gap-8 text-sm font-semibold text-navy lg:flex" [attr.aria-label]="'common.a11y.primaryNavigation' | translate">
          @for (item of navItems; track item.href + item.fragment) {
            <a
              [routerLink]="item.href"
              [fragment]="item.fragment"
              routerLinkActive="text-premium-gold"
              [routerLinkActiveOptions]="{ exact: item.href === '/' && !item.fragment }"
              class="transition hover:text-premium-gold"
            >
              {{ item.labelKey | translate }}
            </a>
          }
        </nav>

        <div class="hidden items-center gap-3 lg:flex">
          <app-language-switcher />
          <a
            routerLink="/"
            fragment="consultation"
            class="inline-flex min-h-12 items-center rounded-full bg-navy px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-700"
          >
            {{ 'common.nav.getConsultation' | translate }}
          </a>
        </div>

        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-full border border-premium-line text-navy lg:hidden"
          [attr.aria-expanded]="isMenuOpen()"
          aria-controls="mobile-menu"
          (click)="toggleMenu()"
        >
          <span class="sr-only">{{ 'common.a11y.openMenu' | translate }}</span>
          <span class="grid gap-1.5">
            <span class="block h-0.5 w-5 bg-current"></span>
            <span class="block h-0.5 w-5 bg-current"></span>
            <span class="block h-0.5 w-5 bg-current"></span>
          </span>
        </button>
      </div>

      @if (isMenuOpen()) {
        <div id="mobile-menu" class="border-t border-premium-line bg-white px-4 py-5 shadow-card lg:hidden">
          <nav class="mx-auto grid w-[min(100%,1200px)] gap-2 text-base font-semibold text-navy">
            @for (item of navItems; track item.href + item.fragment) {
              <a
                [routerLink]="item.href"
                [fragment]="item.fragment"
                class="rounded-2xl px-4 py-3 hover:bg-navy-50"
                (click)="closeMenu()"
              >
                {{ item.labelKey | translate }}
              </a>
            }
            <div class="mt-3 flex items-center justify-between rounded-2xl bg-premium-paper p-3">
              <app-language-switcher />
              <a routerLink="/" fragment="consultation" class="rounded-full bg-navy px-4 py-3 text-sm text-white" (click)="closeMenu()">
                {{ 'common.nav.getConsultation' | translate }}
              </a>
            </div>
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected readonly isMenuOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { labelKey: 'common.nav.home', href: '/' },
    { labelKey: 'common.nav.services', href: '/services' },
    { labelKey: 'common.nav.about', href: '/about' },
    { labelKey: 'common.nav.process', href: '/', fragment: 'process' },
    { labelKey: 'common.nav.faq', href: '/', fragment: 'faq' },
    { labelKey: 'common.nav.contacts', href: '/contacts' },
  ];

  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
