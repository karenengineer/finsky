import { Component, inject, input, signal } from '@angular/core';
import { LocalizationService } from '../../core/i18n/localization.service';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../core/i18n/localization.types';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  host: {
    '(document:click)': 'open.set(false)',
  },
})
export class LanguageSwitcherComponent {
  private readonly localization = inject(LocalizationService);

  readonly theme = input<'dark' | 'light'>('dark');
  readonly open = signal(false);
  readonly languages = SUPPORTED_LANGUAGES.map(code => ({ code }));
  readonly currentLanguage = this.localization.language;

  toggle(event: Event): void {
    event.stopPropagation();
    this.open.update((value) => !value);
  }

  async select(language: LanguageCode, event: Event): Promise<void> {
    event.stopPropagation();
    await this.localization.use(language);
    this.open.set(false);
  }
}
