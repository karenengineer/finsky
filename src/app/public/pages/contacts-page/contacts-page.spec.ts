import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LocalizationService } from '../../../core/i18n/localization.service';
import { PublicContentApiService } from '../../../core/public-api/public-content-api.service';
import { ContactSettings } from '../../../core/public-api/public-content.models';
import { SeoService } from '../../../core/seo/seo.service';
import { ContactsPageComponent } from './contacts-page';

describe('Contacts page', () => {
  it('does not display a company phone card when the phone is not configured', async () => {
    const contacts: ContactSettings = {
      title: 'Contact us',
      description: 'Write to us',
      phone: '',
      email: 'info@finsky.am',
      address: 'Yerevan',
      workingHours: 'Mon-Fri',
      seo: { title: 'Contacts', description: 'Write to us' },
    };

    await TestBed.configureTestingModule({
      imports: [ContactsPageComponent],
      providers: [
        provideRouter([]),
        { provide: LocalizationService, useValue: { language: signal('en'), translate: (key: string) => key } },
        { provide: PublicContentApiService, useValue: { getContacts: () => of(contacts), getServices: () => of([]) } },
        { provide: SeoService, useValue: { apply: () => {} } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactsPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('info@finsky.am');
    expect(text).not.toContain('common.contact.phoneLabel');
  });
});
