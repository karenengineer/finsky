import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-info-page',
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent, TranslatePipe],
  templateUrl: './info-page.html',
  styleUrl: './info-page.scss',
})
export class InfoPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly type = computed(() => this.route.snapshot.data['type'] as 'about' | 'services' | 'privacy');
}
