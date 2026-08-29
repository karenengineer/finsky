import { TestBed } from '@angular/core/testing';
import { LocalizationService } from './localization.service';

describe('LocalizationService', () => {
  const dictionaries = {
    ru: { greeting: { message: 'Здравствуйте, {{name}}' } },
    en: { greeting: { message: 'Hello, {{name}}' } },
    hy: { greeting: { message: 'Բարև, {{name}}' } },
  };

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        const language = url.match(/\/(hy|en|ru)\.json$/)?.[1] as keyof typeof dictionaries;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(dictionaries[language]),
        });
      }),
    );
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads a language and resolves nested keys with interpolation', async () => {
    const service = TestBed.inject(LocalizationService);

    await service.use('en');

    expect(service.language()).toBe('en');
    expect(service.translate('greeting.message', { name: 'Anna' })).toBe('Hello, Anna');
  });

  it('persists the selected language and updates the document language', async () => {
    const service = TestBed.inject(LocalizationService);

    await service.use('hy');

    expect(localStorage.getItem('finkeep.language')).toBe('hy');
    expect(document.documentElement.lang).toBe('hy');
  });

  it('returns the key when a translation is missing', async () => {
    const service = TestBed.inject(LocalizationService);

    await service.use('ru');

    expect(service.translate('missing.key')).toBe('missing.key');
  });
});
