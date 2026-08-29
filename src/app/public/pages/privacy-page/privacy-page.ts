import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { ApiState, PageData } from '../../../core/public-api/public-content.models';
import { SeoService } from '../../../core/seo/seo.service';
import { SectionStateComponent } from '../../components/section-state/section-state';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [SectionStateComponent],
  template: `
    @if (state().status === 'loading') {
      <app-section-state label="Загрузка" message="Загружаем политику конфиденциальности..." />
    } @else if (state().data; as page) {
      <section class="bg-premium-paper/70 py-20 md:py-28">
        <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">Документы</p>
          <h1 class="mt-4 max-w-4xl font-display text-5xl leading-tight tracking-[-0.04em] text-navy md:text-7xl">{{ page.seo.h1 || page.title }}</h1>
          <p class="mt-7 max-w-3xl text-xl leading-9 text-premium-muted">{{ page.intro }}</p>
        </div>
      </section>
      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto grid w-[min(calc(100%-2rem),960px)] gap-6">
          @for (paragraph of page.body; track paragraph) {
            <p class="text-lg leading-9 text-premium-ink">{{ paragraph }}</p>
          }
        </div>
      </section>
    } @else {
      <app-section-state label="Ошибка" [message]="state().error ?? 'Документ временно недоступен.'" />
    }
  `,
})
export class PrivacyPageComponent {
  private readonly api = inject(PublicContentApiService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<ApiState<PageData>>({ status: 'loading', data: null, error: null });

  constructor() {
    this.api
      .getPage('privacy')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.seo.apply(page.seo);
          this.state.set({ status: 'success', data: page, error: null });
        },
        error: () => this.state.set({ status: 'error', data: null, error: 'Политика конфиденциальности временно недоступна.' }),
      });
  }
}
