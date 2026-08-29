import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';
import {
  ConsultationRequestPayload,
  ConsultationResponse,
  ContactSettings,
  PageData,
  PublicHomeContent,
  ServiceDetail,
  ServiceSummary,
} from './public-content.models';
import {
  publicMockContacts,
  publicMockHome,
  publicMockPages,
  publicMockServices,
} from './mock-public-content';

@Injectable({ providedIn: 'root' })
export class PublicContentApiService {
  private readonly http = inject(HttpClient);

  getHome(): Observable<PublicHomeContent> {
    return this.withFallback(this.http.get<PublicHomeContent>('/api/public/home'), publicMockHome);
  }

  getPage(slug: 'about' | 'privacy'): Observable<PageData> {
    return this.withFallback(this.http.get<PageData>(`/api/public/pages/${slug}`), publicMockPages[slug]);
  }

  getServices(): Observable<ServiceSummary[]> {
    const fallback = publicMockServices.map(({ fullDescription, includes, seo, ...service }) => service);
    return this.withFallback(this.http.get<ServiceSummary[]>('/api/public/services'), fallback);
  }

  getServiceBySlug(slug: string): Observable<ServiceDetail | null> {
    return this.http.get<ServiceDetail>(`/api/public/services/${slug}`).pipe(
      catchError(() => of(publicMockServices.find((service) => service.slug === slug) ?? null).pipe(delay(120))),
    );
  }

  getContacts(): Observable<ContactSettings> {
    return this.withFallback(this.http.get<ContactSettings>('/api/public/contacts'), publicMockContacts);
  }

  submitConsultationRequest(payload: ConsultationRequestPayload): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>('/api/public/consultation-requests', payload).pipe(
      catchError(() =>
        of({
          id: crypto.randomUUID(),
          status: 'NEW' as const,
          createdAt: new Date().toISOString(),
        }).pipe(delay(300)),
      ),
    );
  }

  private withFallback<T>(request$: Observable<T>, fallback: T): Observable<T> {
    return request$.pipe(
      map((value) => value ?? fallback),
      catchError(() => of(fallback).pipe(delay(120))),
    );
  }
}
