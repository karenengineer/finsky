export const SUPPORTED_LANGUAGES = ['hy', 'en', 'ru'] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];
export type TranslationParams = Record<string, string | number>;
export type TranslationDictionary = Record<string, unknown>;

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  shortLabel: string;
}

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: 'hy', label: 'Հայերեն', shortLabel: 'HY' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU' },
];
