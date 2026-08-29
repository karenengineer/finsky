import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-service-detail',
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent, TranslatePipe],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetailComponent {
  private readonly route = inject(ActivatedRoute);
  readonly serviceKey = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? 'accounting';
    return ['accounting', 'tax', 'recovery', 'reporting'].includes(slug) ? slug : 'accounting';
  });
}
