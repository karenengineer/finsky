import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TranslationDictionary,
  TranslationParams,
} from './localization.types';

const STORAGE_KEY = 'finsky.language';
const DEFAULT_LANGUAGE: LanguageCode = 'ru';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly document = inject(DOCUMENT);
  private readonly dictionaries = new Map<LanguageCode, TranslationDictionary>();
  private readonly activeLanguage = signal<LanguageCode>(DEFAULT_LANGUAGE);

  readonly language = this.activeLanguage.asReadonly();
  readonly isReady = signal(false);
  readonly locale = computed(() => {
    const locales: Record<LanguageCode, string> = {
      hy: 'hy-AM',
      en: 'en-US',
      ru: 'ru-RU',
    };
    return locales[this.activeLanguage()];
  });

  async initialize(): Promise<void> {
    const language = this.detectInitialLanguage();
    await this.use(language, false);
    this.isReady.set(true);
  }

  async use(language: LanguageCode, persist = true): Promise<void> {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return;
    }

    if (!this.dictionaries.has(language)) {
      const response = await fetch(`assets/i18n/${language}.json`);
      if (!response.ok) {
        throw new Error(`Could not load translations for "${language}".`);
      }
      this.dictionaries.set(language, (await response.json()) as TranslationDictionary);
    }

    this.activeLanguage.set(language);
    this.document.documentElement.lang = language;
    this.document.documentElement.dir = 'ltr';

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }

  translate(key: string, params?: TranslationParams): string {
    const dictionary = this.dictionaries.get(this.activeLanguage());
    const fallback = this.dictionaries.get(DEFAULT_LANGUAGE);
    const value = this.resolve(dictionary, key) ?? this.resolve(fallback, key) ?? key;

    if (typeof value !== 'string') {
      return key;
    }

    if (!params) {
      return value;
    }

    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) =>
      params[name] === undefined ? `{{${name}}}` : String(params[name]),
    );
  }

  private detectInitialLanguage(): LanguageCode {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (this.isLanguageCode(stored)) {
      return stored;
    }

    const browserLanguage =
      typeof navigator !== 'undefined' ? navigator.language.toLowerCase().split('-')[0] : '';
    return this.isLanguageCode(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE;
  }

  private isLanguageCode(value: string | null): value is LanguageCode {
    return SUPPORTED_LANGUAGES.includes(value as LanguageCode);
  }

  private resolve(dictionary: TranslationDictionary | undefined, key: string): unknown {
    return key.split('.').reduce<unknown>((current, part) => {
      if (!current || typeof current !== 'object') {
        return undefined;
      }
      return (current as TranslationDictionary)[part];
    }, dictionary);
  }
}
