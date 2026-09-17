import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeSectionCopy, ServiceSummary } from '../../../core/public-api/public-content.models';

@Component({
  selector: 'app-services-preview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section id="services" class="bg-premium-paper/70 py-20 md:py-28">
      <div class="mx-auto w-[min(calc(100%-2rem),1200px)]">
        <div class="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-premium-gold">{{ copy().eyebrow }}</p>
            <h2 class="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-navy md:text-6xl">
              {{ copy().title }}
            </h2>
            @if (copy().description) {
              <p class="mt-4 max-w-2xl leading-7 text-premium-muted">{{ copy().description }}</p>
            }
          </div>
          <a routerLink="/services" class="inline-flex min-h-12 items-center justify-center rounded-full border border-navy px-5 text-sm font-bold text-navy transition hover:bg-navy hover:text-white">
            {{ copy().allServicesLabel }}
          </a>
        </div>

        @if (services().length) {
          <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            @for (service of services(); track service.id) {
              <a
                [routerLink]="['/services', service.slug]"
                class="group min-h-64 rounded-premium border border-premium-line bg-white p-7 shadow-card transition hover:-translate-y-1 hover:shadow-premium"
              >
                <span class="text-sm font-bold text-premium-gold">{{ service.order.toString().padStart(2, '0') }}</span>
                <h3 class="mt-8 text-2xl font-bold tracking-tight text-navy">{{ service.title }}</h3>
                <p class="mt-4 leading-7 text-premium-muted">{{ service.shortDescription }}</p>
                <span class="mt-8 inline-flex text-sm font-bold text-navy transition group-hover:text-premium-gold">{{ copy().detailLabel }} →</span>
              </a>
            }
          </div>
        } @else {
          <p class="rounded-premium border border-premium-line bg-white p-8 text-premium-muted">{{ copy().emptyLabel }}</p>
        }
      </div>
    </section>
  `,
})
export class ServicesPreviewComponent {
  readonly services = input.required<ServiceSummary[]>();
  readonly copy = input.required<HomeSectionCopy['services']>();
}
