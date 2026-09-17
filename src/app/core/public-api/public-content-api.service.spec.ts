import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalizationService } from '../i18n/localization.service';
import { PublicContentApiService } from './public-content-api.service';

describe('Static public content', () => {
  let language: string;
  let service: PublicContentApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    language = 'ru';
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(), provideHttpClientTesting(),
      { provide: LocalizationService, useValue: { language: () => language } },
    ] });
    service = TestBed.inject(PublicContentApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads and caches content separately for each selected language', () => {
    for (const locale of ['ru', 'en', 'hy']) {
      language = locale;
      service.getPage('about').subscribe(page => expect(page.title).toBe(locale));
      http.expectOne(`assets/content/${locale}/about.json`).flush({ title: locale });
    }
    language = 'ru';
    service.getPage('about').subscribe(page => expect(page.title).toBe('ru'));
    http.expectNone('assets/content/ru/about.json');
  });

  it('returns null for an unknown service without calling a backend', () => {
    service.getServiceBySlug('missing').subscribe(value => expect(value).toBeNull());
    http.expectOne('assets/content/ru/services.json').flush([]);
  });

  it('propagates missing content errors instead of inventing a successful response', () => {
    let failed = false;
    service.getContacts().subscribe({ error: () => { failed = true; } });
    http.expectOne('assets/content/ru/contacts.json').flush(null, { status: 404, statusText: 'Not Found' });
    expect(failed).toBe(true);
  });
});
