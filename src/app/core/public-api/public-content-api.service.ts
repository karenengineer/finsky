import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';
import { LocalizationService } from '../i18n/localization.service';
import { ContactSettings, PageData, PublicHomeContent, ServiceDetail, ServiceSummary } from './public-content.models';

@Injectable({ providedIn: 'root' })
export class PublicContentApiService {
  private readonly http = inject(HttpClient);
  private readonly localization = inject(LocalizationService);
  private readonly cache = new Map<string, Observable<unknown>>();

  getHome(): Observable<PublicHomeContent> {
    return forkJoin({
      home: this.read<Omit<PublicHomeContent, 'services' | 'contacts'>>('home'),
      services: this.getServices(),
      contacts: this.getContacts(),
    }).pipe(map(({ home, services, contacts }) => ({ ...home, services, contacts })));
  }

  getPage(slug: 'about' | 'privacy'): Observable<PageData> {
    return this.read<PageData>(slug);
  }

  getServices(): Observable<ServiceSummary[]> {
    return this.read<ServiceDetail[]>('services');
  }

  getServiceBySlug(slug: string): Observable<ServiceDetail | null> {
    return this.read<ServiceDetail[]>('services').pipe(
      map(services => services.find(service => service.slug === slug) ?? null),
    );
  }

  getContacts(): Observable<ContactSettings> {
    return this.read<ContactSettings>('contacts');
  }

  private read<T>(page: string): Observable<T> {
    const url = `assets/content/${this.localization.language()}/${page}.json`;
    if (!this.cache.has(url)) {
      this.cache.set(url, this.http.get<T>(url).pipe(shareReplay({ bufferSize: 1, refCount: false })));
    }
    return this.cache.get(url) as Observable<T>;
  }
}
