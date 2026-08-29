import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../shared/language-switcher/language-switcher';

@Component({ selector: 'app-not-found', imports: [RouterLink, TranslatePipe, LanguageSwitcherComponent], templateUrl: './not-found.html', styleUrl: './not-found.scss' })
export class NotFoundComponent {}
