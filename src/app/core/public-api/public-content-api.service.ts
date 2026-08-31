import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { LocalizationService } from '../i18n/localization.service';
import {
  Benefit,
  ConsultationRequestPayload,
  ConsultationResponse,
  ContactSettings,
  FaqItem,
  PageData,
  PublicHomeContent,
  ServiceDetail,
  ServiceSummary,
  WorkStep,
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
  private readonly localization = inject(LocalizationService);

  getHome(): Observable<PublicHomeContent> {
    return this.http.get<PublicHomeContent>('/api/public/home').pipe(
      map((content) => this.localizeHome(content ?? publicMockHome, !content)),
      catchError(() => of(this.localizeHome(publicMockHome, true)).pipe(delay(120))),
    );
  }

  getPage(slug: 'about' | 'privacy'): Observable<PageData> {
    return this.withFallback(this.http.get<PageData>(`/api/public/pages/${slug}`), publicMockPages[slug]).pipe(
      map((page) => this.localizePage(page, slug)),
    );
  }

  getServices(): Observable<ServiceSummary[]> {
    const fallback = publicMockServices.map(({ fullDescription, includes, seo, ...service }) => service);
    return this.withFallback(this.http.get<ServiceSummary[]>('/api/public/services'), fallback).pipe(
      map((services) => services.map((service) => this.localizeService(service))),
    );
  }

  getServiceBySlug(slug: string): Observable<ServiceDetail | null> {
    return this.http.get<ServiceDetail>(`/api/public/services/${slug}`).pipe(
      map((service) => this.localizeServiceDetail(service)),
      catchError(() =>
        of(this.localizeServiceDetail(publicMockServices.find((service) => service.slug === slug) ?? null)).pipe(
          delay(120),
        ),
      ),
    );
  }

  getContacts(): Observable<ContactSettings> {
    return this.withFallback(this.http.get<ContactSettings>('/api/public/contacts'), publicMockContacts).pipe(
      map((contacts) => this.localizeContacts(contacts)),
    );
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

  private localizeHome(content: PublicHomeContent, force = false): PublicHomeContent {
    if (!force && this.localization.language() === 'ru') {
      return content;
    }

    const localizedServices = content.services.map((service) => this.localizeService(service));

    return {
      ...content,
      seo: {
        title: this.t('titles.home'),
        description: this.t('home.hero.description'),
        h1: this.t('home.hero.title'),
      },
      hero: {
        ...content.hero,
        eyebrow: this.t('home.hero.kicker'),
        title: `${this.t('home.hero.title')} ${this.t('home.hero.accent')}`,
        description: this.t('home.hero.description'),
        primaryCtaLabel: this.t('common.nav.getConsultation'),
        secondaryCtaLabel: this.t('home.hero.servicesLink'),
        highlights: [
          this.t('home.hero.proofPrivacy'),
          this.t('home.hero.proofContract'),
          this.t('home.hero.proofExpert'),
        ],
      },
      services: localizedServices,
      benefits: this.localizeBenefits(content.benefits),
      about: {
        ...content.about,
        eyebrow: this.t('home.about.kicker'),
        title: this.t('home.about.title'),
        description: this.t('home.about.description'),
        ctaLabel: this.t('common.actions.learnMore'),
      },
      team: {
        ...content.team,
        label: this.t('home.team.label'),
        title: this.t('home.team.title'),
        description: this.t('home.team.description'),
        ctaText: this.t('home.team.ctaText'),
        trustPoints: [
          this.t('home.team.trustProfessional'),
          this.t('home.team.trustPrivacy'),
          this.t('home.team.trustBusiness'),
        ],
      },
      statistics: content.statistics.map((statistic) => ({
        ...statistic,
        label: this.t(`home.trust.${statistic.id}`, undefined, statistic.label),
      })),
      workSteps: this.localizeWorkSteps(content.workSteps),
      testimonials: content.testimonials.map((testimonial, index) =>
        index === 0
          ? {
              ...testimonial,
              authorName: this.t('home.testimonial.author'),
              authorRole: this.t('home.testimonial.role'),
              text: this.t('home.testimonial.quote'),
            }
          : testimonial,
      ),
      faq: this.localizeFaq(content.faq),
      contacts: {
        ...content.contacts,
        title: this.t('home.consultation.title'),
        description: this.t('home.consultation.description'),
        phone: this.t('common.contact.phone', undefined, content.contacts.phone),
        email: this.t('common.contact.email', undefined, content.contacts.email),
        address: this.t('common.contact.office', undefined, content.contacts.address),
        workingHours: this.t('common.contact.hours', undefined, content.contacts.workingHours),
      },
      sections: {
        services: {
          eyebrow: this.t('home.services.kicker'),
          title: this.t('home.services.title'),
          description: this.t('home.services.description'),
          allServicesLabel: this.t('common.actions.allServices'),
          detailLabel: this.t('common.actions.learnMore'),
          emptyLabel: this.t('public.states.noServices'),
        },
        benefits: {
          eyebrow: this.t('home.benefits.kicker'),
          title: this.t('home.benefits.title'),
          description: this.t('home.benefits.description'),
        },
        statistics: {
          eyebrow: this.t('home.trust.kicker'),
          title: this.t('home.trust.title'),
        },
        workProcess: {
          eyebrow: this.t('home.process.kicker'),
          title: this.t('home.process.title'),
          description: this.t('home.process.description'),
        },
        testimonials: {
          eyebrow: this.t('home.testimonial.kicker'),
          title: this.t('home.testimonial.title'),
        },
        faq: {
          eyebrow: this.t('home.faq.kicker'),
          title: this.t('home.faq.title'),
          description: this.t('home.faq.description'),
        },
        consultation: {
          eyebrow: this.t('home.consultation.kicker'),
          title: this.t('home.consultation.title'),
          description: this.t('home.consultation.description'),
          submitLabel: this.t('common.actions.send'),
          submittingLabel: this.t('public.form.submitting'),
          successRedirect: content.sections.consultation.successRedirect,
          consentText: this.t('public.form.consentPrefix'),
        },
      },
    };
  }

  private localizePage(page: PageData, slug: 'about' | 'privacy'): PageData {
    if (this.localization.language() === 'ru') {
      return page;
    }

    if (slug === 'about') {
      return {
        ...page,
        title: this.t('aboutPage.title', undefined, page.title),
        intro: this.t('aboutPage.intro', undefined, page.intro),
        body: [
          this.t('aboutPage.p1', undefined, page.body[0]),
          this.t('aboutPage.p2', undefined, page.body[1]),
        ],
        seo: {
          title: this.t('titles.about'),
          description: this.t('aboutPage.intro', undefined, page.seo.description),
          h1: this.t('aboutPage.title', undefined, page.seo.h1),
        },
      };
    }

    return {
      ...page,
      title: this.t('privacyPage.title', undefined, page.title),
      intro: this.t('privacyPage.revision', undefined, page.intro),
      body: [
        this.t('privacyPage.sections.general.text', undefined, page.body[0]),
        this.t('privacyPage.sections.data.text', undefined, page.body[1]),
        this.t('privacyPage.sections.purpose.text', undefined, page.body[2]),
        this.t('privacyPage.sections.rights.text', undefined, page.body[3]),
      ].filter(Boolean),
      seo: {
        title: this.t('titles.privacy'),
        description: this.t('privacyPage.title', undefined, page.seo.description),
        h1: this.t('privacyPage.title', undefined, page.seo.h1),
      },
    };
  }

  private localizeService<T extends ServiceSummary>(service: T): T {
    const key = this.serviceKey(service.slug);
    if (!key || this.localization.language() === 'ru') {
      return service;
    }

    return {
      ...service,
      title: this.t(`servicesPage.items.${key}.title`, undefined, service.title),
      shortDescription: this.t(`servicesPage.items.${key}.text`, undefined, service.shortDescription),
    };
  }

  private localizeServiceDetail(service: ServiceDetail | null): ServiceDetail | null {
    if (!service) {
      return null;
    }

    const key = this.serviceKey(service.slug);
    if (!key || this.localization.language() === 'ru') {
      return service;
    }

    const title = this.t(`servicesPage.items.${key}.title`, undefined, service.title);
    return {
      ...this.localizeService(service),
      fullDescription: this.t(`serviceDetail.items.${key}.intro`, undefined, service.fullDescription),
      seo: {
        title: `${title} | FinSky`,
        description: this.t(`servicesPage.items.${key}.text`, undefined, service.seo.description),
        h1: title,
      },
    };
  }

  private localizeBenefits(benefits: Benefit[]): Benefit[] {
    const keys = ['responsibility', 'clarity', 'security', 'foresight'];
    return benefits.map((benefit, index) => {
      const key = keys[index];
      return key
        ? {
            ...benefit,
            title: this.t(`home.benefits.items.${key}.title`, undefined, benefit.title),
            description: this.t(`home.benefits.items.${key}.text`, undefined, benefit.description),
          }
        : benefit;
    });
  }

  private localizeWorkSteps(steps: WorkStep[]): WorkStep[] {
    const keys = ['intro', 'audit', 'plan', 'support', 'report'];
    return steps.map((step, index) => {
      const key = keys[index];
      return key
        ? {
            ...step,
            title: this.t(`home.process.items.${key}.title`, undefined, step.title),
            description: this.t(`home.process.items.${key}.text`, undefined, step.description),
          }
        : step;
    });
  }

  private localizeFaq(items: FaqItem[]): FaqItem[] {
    const keys = ['full', 'transition', 'privacy', 'price'];
    return items.map((item, index) => {
      const key = keys[index];
      return key
        ? {
            ...item,
            question: this.t(`home.faq.items.${key}.q`, undefined, item.question),
            answer: this.t(`home.faq.items.${key}.a`, undefined, item.answer),
          }
        : item;
    });
  }

  private localizeContacts(contacts: ContactSettings): ContactSettings {
    if (this.localization.language() === 'ru') {
      return contacts;
    }

    return {
      ...contacts,
      title: this.t('contactsPage.title', undefined, contacts.title),
      description: this.t('contactsPage.intro', undefined, contacts.description),
      phone: this.t('common.contact.phone', undefined, contacts.phone),
      email: this.t('common.contact.email', undefined, contacts.email),
      address: this.t('common.contact.office', undefined, contacts.address),
      workingHours: this.t('common.contact.hours', undefined, contacts.workingHours),
    };
  }

  private serviceKey(slug: string): string | null {
    const keys: Record<string, string> = {
      'accounting-support': 'accounting',
      'tax-consulting': 'tax',
      reporting: 'reporting',
      payroll: 'payroll',
      'accounting-recovery': 'recovery',
      'financial-consulting': 'financialConsulting',
    };
    return keys[slug] ?? null;
  }

  private t(key: string, params?: Record<string, string | number>, fallback?: string): string {
    const value = this.localization.translate(key, params);
    return value === key ? (fallback ?? key) : value;
  }
}
