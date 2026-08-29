import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({ selector: 'app-contact', imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent, TranslatePipe], templateUrl: './contact.html', styleUrl: './contact.scss' })
export class ContactComponent {}
