import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TeamSectionComponent } from '../../shared/team-section/team-section';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent, TranslatePipe, TeamSectionComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  readonly services = [
    { n: '01', key: 'accounting', slug: 'accounting' },
    { n: '02', key: 'tax', slug: 'tax' },
    { n: '03', key: 'recovery', slug: 'recovery' },
    { n: '04', key: 'reporting', slug: 'reporting' },
  ];

  readonly faqs = [
    'full',
    'transition',
    'privacy',
    'price',
  ];
}
