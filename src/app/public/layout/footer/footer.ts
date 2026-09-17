import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="bg-navy text-white">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div class="text-2xl font-bold">{{ 'common.brand' | translate }}</div>
          <p class="mt-4 max-w-md text-sm leading-7 text-white/70">
            {{ 'common.footer.description' | translate }}
          </p>
        </div>
        <div>
          <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-premium-gold">{{ 'common.footer.company' | translate }}</h2>
          <div class="mt-4 grid gap-3 text-sm text-white/75">
            <a routerLink="/services" class="hover:text-white">{{ 'common.nav.services' | translate }}</a>
            <a routerLink="/about" class="hover:text-white">{{ 'common.nav.about' | translate }}</a>
            <a routerLink="/contacts" class="hover:text-white">{{ 'common.nav.contacts' | translate }}</a>
            <a routerLink="/privacy" class="hover:text-white">{{ 'common.footer.privacy' | translate }}</a>
          </div>
        </div>
        <div>
          <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-premium-gold">{{ 'common.footer.connect' | translate }}</h2>
          <div class="mt-4 grid gap-3 text-sm text-white/75">
            @if (contacts(); as contact) {
              <a [href]="'mailto:' + contact.email" class="hover:text-white">{{ contact.email }}</a>
              <span>{{ contact.phone }}</span>
              <span>{{ contact.address }}</span>
            }
          </div>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="mx-auto flex w-[min(calc(100%-2rem),1200px)] flex-col gap-3 py-5 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <span>{{ 'common.footer.copyright' | translate: { year: currentYear } }}</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private readonly localization = inject(LocalizationService);
  private readonly content = inject(PublicContentApiService);
  protected readonly contacts = toSignal(toObservable(this.localization.language).pipe(
    switchMap(() => this.content.getContacts().pipe(catchError(() => of(null)))),
  ));
  protected readonly currentYear = new Date().getFullYear();
}
