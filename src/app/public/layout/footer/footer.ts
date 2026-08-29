import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-navy text-white">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div class="text-2xl font-bold">FinSky</div>
          <p class="mt-4 max-w-md text-sm leading-7 text-white/70">
            Бухгалтерское сопровождение, налоговые консультации и финансовая ясность для бизнеса в Yerevan, Armenia.
          </p>
        </div>
        <div>
          <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-premium-gold">Навигация</h2>
          <div class="mt-4 grid gap-3 text-sm text-white/75">
            <a routerLink="/services" class="hover:text-white">Услуги</a>
            <a routerLink="/about" class="hover:text-white">О компании</a>
            <a routerLink="/contacts" class="hover:text-white">Контакты</a>
            <a routerLink="/privacy" class="hover:text-white">Политика конфиденциальности</a>
          </div>
        </div>
        <div>
          <h2 class="text-sm font-bold uppercase tracking-[0.18em] text-premium-gold">Связь</h2>
          <div class="mt-4 grid gap-3 text-sm text-white/75">
            <a href="mailto:hello@finsky.am" class="hover:text-white">hello&#64;finsky.am</a>
            <a href="tel:+37400000000" class="hover:text-white">+374 XX XXX XXX</a>
            <span>Yerevan, Armenia</span>
          </div>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="mx-auto flex w-[min(calc(100%-2rem),1200px)] flex-col gap-3 py-5 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <span>© {{ currentYear }} FinSky. Все права защищены.</span>
          <a routerLink="/admin" class="hover:text-white">Admin</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
