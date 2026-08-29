import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../shared/language-switcher/language-switcher';

@Component({ selector: 'app-success', imports: [RouterLink, TranslatePipe, LanguageSwitcherComponent], templateUrl: './success.html', styleUrl: './success.scss' })
export class SuccessComponent {}
