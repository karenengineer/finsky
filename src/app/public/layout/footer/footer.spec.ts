import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { FooterComponent } from './footer';

describe('Footer', () => {
  it('hides the company phone when no number is configured', async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([]),
        { provide: LocalizationService, useValue: { language: signal('en'), translate: (key: string) => key } },
        { provide: PublicContentApiService, useValue: { getContacts: () => of({ email: 'info@finsky.am', phone: '', address: 'Yerevan' }) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FooterComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer')!;
    expect(footer.textContent).toContain('info@finsky.am');
    const contactBlock = footer.querySelector('a[href^="mailto:"]')?.parentElement;
    expect(contactBlock?.querySelectorAll('span')).toHaveLength(1);
  });
});
