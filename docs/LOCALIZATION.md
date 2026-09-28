# Localization

## Frontend architecture

Translations live in:

```text
src/assets/i18n/
  hy.json
  en.json
  ru.json
```

`LocalizationService` loads dictionaries on demand, stores the selected language in `localStorage`, detects the browser language on first visit, and updates the document `lang` attribute.

The selection priority is:

1. Saved `finsky.language` value.
2. Supported browser language.
3. Russian fallback.

Templates use the standalone pipe:

```html
<h1>{{ 'home.hero.title' | translate }}</h1>
```

Interpolation is supported:

```ts
localization.translate('greeting', { name: 'Anna' });
```

All API requests made through Angular `HttpClient` include:

```http
Accept-Language: hy
```

## Adding another language

1. Add its code to `SUPPORTED_LANGUAGES`.
2. Add an entry to `LANGUAGE_OPTIONS`.
3. Create `src/assets/i18n/<code>.json`.
4. Keep its key structure identical to the existing dictionaries.
5. Add its locale mapping in `LocalizationService.locale`.

## Backend contract

This repository does not currently contain the NestJS application. When it is added, the backend should read `Accept-Language`, validate it against `hy`, `en`, and `ru`, and fall back to `ru`.

For localized CMS content, prefer structured fields instead of translated column names:

```ts
interface LocalizedText {
  hy: string;
  en: string;
  ru: string;
}

interface ServiceContent {
  title: LocalizedText;
  description: LocalizedText;
}
```

The API can either return all language variants for admin editors or resolve one language for public endpoints based on `Accept-Language`.

## Team background section

The team section uses the same `hy`, `en`, and `ru` content shape as a future CMS endpoint. Until backend content storage is connected, `TeamSectionService` loads defaults from the translation JSON files and persists admin changes in `localStorage`.

The admin editor is available at `/admin/team-section` for `ADMIN` and `SUPER_ADMIN`. Its data shape includes visibility, background image, overlay opacity, CTA link, order, and localized text.
