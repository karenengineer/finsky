export const SUPPORTED_LANGUAGES = ['hy', 'en', 'ru'] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];
export type TranslationParams = Record<string, string | number>;
export type TranslationDictionary = Record<string, unknown>;
