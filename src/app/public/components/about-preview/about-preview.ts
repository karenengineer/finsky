import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutPreview, TeamTrustSection } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-about-preview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="bg-white py-20 md:py-28">
      <div class="mx-auto grid w-[min(calc(100%-2rem),1200px)] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ about().eyebrow }}</p>
          <h2 class="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-navy md:text-6xl">
            {{ about().title }}
          </h2>
          <p class="mt-6 text-lg leading-8 text-premium-muted">{{ about().description }}</p>
          <a [routerLink]="about().ctaHref" class="mt-8 inline-flex min-h-12 items-center rounded-full bg-navy px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-700">
            {{ about().ctaLabel }}
          </a>
        </div>
        <div class="rounded-[2rem] bg-premium-paper p-4">
          <div class="aspect-[4/3] rounded-[1.5rem] bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center shadow-card"></div>
        </div>
      </div>

      @if (team().isVisible) {
        <div class="mx-auto mt-16 w-[min(calc(100%-2rem),1200px)] overflow-hidden rounded-[2rem] shadow-premium">
          <section
            class="relative bg-cover bg-center px-6 py-20 md:px-12 md:py-28"
            [style.background-image]="'url(' + team().backgroundImageUrl + ')'"
          >
            <div class="absolute inset-0 bg-navy" [style.opacity]="team().overlayOpacity"></div>
            <div class="relative max-w-3xl text-white">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ team().label }}</p>
              <h3 class="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] md:text-6xl">{{ team().title }}</h3>
              <p class="mt-6 text-lg leading-8 text-white/80">{{ team().description }}</p>
              <div class="mt-8 flex flex-wrap gap-3">
                @for (point of team().trustPoints; track point) {
                  <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">{{ point }}</span>
                }
              </div>
              <a [routerLink]="team().ctaLink" class="mt-9 inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:bg-premium-paper">
                {{ team().ctaText }}
              </a>
            </div>
          </section>
        </div>
      }
    </section>
  `,
})
export class AboutPreviewComponent {
  readonly about = input.required<AboutPreview>();
  readonly team = input.required<TeamTrustSection>();
}
