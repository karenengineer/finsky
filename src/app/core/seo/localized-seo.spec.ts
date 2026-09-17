import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { LocalizationService } from '../i18n/localization.service';
import { NotFoundPageComponent } from '../../public/pages/not-found-page/not-found-page';
import { ThankYouPageComponent } from '../../public/pages/thank-you-page/thank-you-page';

describe('Localized page metadata', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      const language = url.match(/\/(hy|en|ru)\.json$/)?.[1];
      return Promise.resolve({ ok: true, json: () => Promise.resolve({
        seo: {
          notFound: { title: `${language} missing page`, description: `${language} missing page description` },
          thankYou: { title: `${language} email page`, description: `${language} email page description` },
        },
      }) });
    }));
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => vi.unstubAllGlobals());

  const cases: [Type<unknown>, string][] = [[NotFoundPageComponent, 'missing'], [ThankYouPageComponent, 'email']];
  for (const [component, label] of cases) {
    it(`updates ${label} page title, description and document language`, async () => {
      const localization = TestBed.inject(LocalizationService);
      const fixture = TestBed.createComponent(component);
      for (const language of ['ru', 'en', 'hy'] as const) {
        await localization.use(language);
        fixture.detectChanges();
        expect(TestBed.inject(Title).getTitle()).toBe(`${language} ${label} page`);
        expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe(`${language} ${label} page description`);
        expect(document.documentElement.lang).toBe(language);
      }
    });
  }
});
