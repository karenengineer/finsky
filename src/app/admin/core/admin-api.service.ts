import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of, throwError } from 'rxjs';
import {
  AdminDashboard,
  AdminHomeContent,
  AdminServiceItem,
  ContactAdminSettings,
  ConsultationRequestAdmin,
  ContentItem,
  ContentType,
  MediaFileAdmin,
  RequestStatus,
  SeoAdminSettings,
  LocalizationDictionaries,
  LocalizationLanguage,
} from './admin.models';

const now = new Date().toISOString();

const services: AdminServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Бухгалтерское сопровождение бизнеса',
    slug: 'accounting-support',
    shortDescription: 'Регулярное ведение учета, документов и отчетности.',
    fullDescription: 'Комплексное сопровождение бухгалтерских процессов для малого и среднего бизнеса.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    order: 1,
    status: 'PUBLISHED',
    updatedAt: now,
  },
  {
    id: 'srv-2',
    title: 'Налоговый консалтинг',
    slug: 'tax-consulting',
    shortDescription: 'Консультации по налоговой нагрузке, рискам и обязательствам.',
    fullDescription: 'Помогаем разобраться с налоговой ситуацией и выбрать практичный путь действий.',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
    order: 2,
    status: 'PUBLISHED',
    updatedAt: now,
  },
];

const requests: ConsultationRequestAdmin[] = [
  {
    id: 'req-1',
    name: 'Анна Волкова',
    phone: '+374 91 000 111',
    email: 'anna@example.com',
    company: 'Meridian LLC',
    service: 'Бухгалтерское сопровождение бизнеса',
    message: 'Нужно передать бухгалтерию на сопровождение со следующего месяца.',
    status: 'NEW',
    createdAt: now,
  },
  {
    id: 'req-2',
    name: 'Игорь Петросян',
    phone: '+374 77 222 333',
    email: 'igor@example.com',
    company: 'Studio AM',
    service: 'Налоговый консалтинг',
    message: 'Хотим оценить налоговые риски перед новым контрактом.',
    status: 'IN_PROGRESS',
    createdAt: now,
  },
];

const contentItems: Record<ContentType, ContentItem[]> = {
  pages: [
    { id: 'home', title: 'Главная страница', description: 'Hero, about, CTA и основные блоки', order: 1, status: 'PUBLISHED', updatedAt: now },
    { id: 'about', title: 'О компании', description: 'Описание компании и подхода', order: 2, status: 'PUBLISHED', updatedAt: now },
  ],
  benefits: [
    { id: 'accuracy', title: 'Точность в деталях', description: 'Проверяем данные, сроки и документы.', order: 1, status: 'PUBLISHED', updatedAt: now },
    { id: 'privacy', title: 'Конфиденциальность', description: 'Бережно работаем с финансовыми данными.', order: 2, status: 'PUBLISHED', updatedAt: now },
  ],
  statistics: [
    { id: 'clients', title: '[N]+', description: 'компаний после подтверждения данных', order: 1, status: 'HIDDEN', updatedAt: now },
    { id: 'city', title: 'Yerevan', description: 'локальная экспертиза для бизнеса', order: 2, status: 'PUBLISHED', updatedAt: now },
  ],
  'work-steps': [
    { id: 'brief', title: 'Знакомимся с задачей', description: 'Уточняем формат бизнеса и текущую ситуацию.', order: 1, status: 'PUBLISHED', updatedAt: now },
    { id: 'plan', title: 'Предлагаем план', description: 'Формируем объем работ и график.', order: 2, status: 'PUBLISHED', updatedAt: now },
  ],
  testimonials: [
    { id: 'demo-1', title: 'Шаблонный отзыв', description: 'Демо-текст для замены реальным отзывом.', order: 1, status: 'PUBLISHED', updatedAt: now },
  ],
  faq: [
    { id: 'remote', title: 'Можно ли работать удаленно?', description: 'Да, процессы можно организовать дистанционно.', order: 1, status: 'PUBLISHED', updatedAt: now },
  ],
};

const contacts: ContactAdminSettings = {
  phone: '+374 XX XXX XXX',
  email: 'hello@finsky.am',
  address: 'Yerevan, Armenia',
  workingHours: 'Пн-Пт, 10:00-18:00',
  telegram: '@finsky',
};

const seo: SeoAdminSettings[] = [
  { id: 'seo-home', page: 'Главная', metaTitle: 'FinSky | Бухгалтерский консалтинг', metaDescription: 'Бухгалтерское сопровождение и налоговые консультации в Yerevan.', ogImageUrl: '' },
  { id: 'seo-services', page: 'Услуги', metaTitle: 'Услуги | FinSky', metaDescription: 'Бухгалтерские, налоговые и финансовые услуги для бизнеса.', ogImageUrl: '' },
];

const media: MediaFileAdmin[] = [
  { id: 'media-1', name: 'team-background.jpg', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80', size: '420 KB', uploadedAt: now },
];

const homeContent: AdminHomeContent = {
  hero: {
    eyebrow: 'FinSky · Yerevan, Armenia',
    title: 'Бухгалтерия и налоговые консультации, которые дают бизнесу спокойствие',
    description: 'Помогаем предпринимателям и компаниям вести учет, готовить отчетность и принимать финансовые решения с уверенностью.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85',
    primaryCtaLabel: 'Получить консультацию',
    primaryCtaHref: '#consultation',
    secondaryCtaLabel: 'Посмотреть услуги',
    secondaryCtaHref: '/services',
    highlights: ['Конфиденциально', 'Понятно для владельца', 'С фокусом на бизнес'],
  },
  about: {
    eyebrow: 'О компании',
    title: 'FinSky помогает бизнесу держать финансы под контролем',
    description: 'Мы сопровождаем бухгалтерские и налоговые процессы для малого и среднего бизнеса, индивидуальных предпринимателей и стартапов.',
    ctaLabel: 'Подробнее о компании',
    ctaHref: '/about',
  },
  team: {
    isVisible: true,
    backgroundImageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85',
    overlayOpacity: 0.68,
    label: 'Наша команда',
    title: 'Экспертная команда для уверенного ведения бизнеса',
    description: 'Мы объединяем бухгалтерскую точность, налоговую экспертизу и практический подход, чтобы бизнес мог сосредоточиться на развитии.',
    ctaText: 'Подробнее о компании',
    ctaLink: '/about',
    trustPoints: ['Профессиональный подход', 'Конфиденциальность', 'Консалтинг с фокусом на бизнес'],
  },
  sections: {
    services: { eyebrow: 'Услуги', title: 'Бухгалтерские процессы, которые можно передать профессионалам', description: 'Выберите направление, чтобы подробнее узнать о формате работы и составе услуги.', allServicesLabel: 'Все услуги', detailLabel: 'Подробнее', emptyLabel: 'Услуги пока не опубликованы.' },
    benefits: { eyebrow: 'Почему выбирают нас', title: 'Надежная опора для регулярных финансовых процессов', description: 'Точность, конфиденциальность и понятная коммуникация без лишнего шума.' },
    statistics: { eyebrow: 'Доверие', title: 'Показатели, которые можно заменить подтвержденными данными' },
    workProcess: { eyebrow: 'Как мы работаем', title: 'Понятный процесс без лишнего шума', description: 'Организуем старт и сопровождение так, чтобы бизнес продолжал работать спокойно.' },
    testimonials: { eyebrow: 'Отзывы', title: 'Что важно клиентам в работе с бухгалтерией' },
    faq: { eyebrow: 'FAQ', title: 'Частые вопросы', description: 'Короткие ответы на вопросы, которые обычно возникают перед стартом сотрудничества.' },
    consultation: { eyebrow: 'Заявка на консультацию', title: 'Обсудим, как привести бухгалтерские процессы в порядок', description: 'Оставьте контакты, и мы свяжемся с вами, чтобы уточнить задачу и предложить следующий шаг.', submitLabel: 'Отправить заявку', submittingLabel: 'Отправляем...', successRedirect: '/thank-you', consentText: 'Я согласен на обработку данных и ознакомлен с' },
  },
};

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<AdminDashboard> {
    return this.withFallback(this.http.get<AdminDashboard>('/api/admin/dashboard'), {
      totalRequests: requests.length,
      newRequests: requests.filter((request) => request.status === 'NEW').length,
      publishedServices: services.filter((service) => service.status === 'PUBLISHED').length,
      testimonials: contentItems.testimonials.length,
      latestRequests: requests,
    });
  }

  getServices(): Observable<AdminServiceItem[]> {
    return this.withFallback(this.http.get<AdminServiceItem[]>('/api/admin/services'), services);
  }

  getService(id: string): Observable<AdminServiceItem | null> {
    return this.http.get<AdminServiceItem>(`/api/admin/services/${id}`).pipe(
      catchError(() => of(services.find((service) => service.id === id) ?? null).pipe(delay(120))),
    );
  }

  saveService(payload: AdminServiceItem): Observable<AdminServiceItem> {
    const request$ = payload.id
      ? this.http.patch<AdminServiceItem>(`/api/admin/services/${payload.id}`, payload)
      : this.http.post<AdminServiceItem>('/api/admin/services', payload);
    return request$.pipe(catchError(() => of(this.upsertService(payload)).pipe(delay(180))));
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/services/${id}`).pipe(
      catchError(() => {
        const index = services.findIndex((service) => service.id === id);
        if (index >= 0) {
          services.splice(index, 1);
        }
        return of(void 0).pipe(delay(150));
      }),
    );
  }

  getRequests(status = 'ALL', query = ''): Observable<ConsultationRequestAdmin[]> {
    const params = { status, q: query };
    const filtered = requests.filter((request) => {
      const matchesStatus = status === 'ALL' || request.status === status;
      const haystack = `${request.name} ${request.phone} ${request.email}`.toLowerCase();
      return matchesStatus && haystack.includes(query.toLowerCase());
    });
    return this.withFallback(this.http.get<ConsultationRequestAdmin[]>('/api/admin/requests', { params }), filtered);
  }

  getRequest(id: string): Observable<ConsultationRequestAdmin | null> {
    return this.http.get<ConsultationRequestAdmin>(`/api/admin/requests/${id}`).pipe(
      catchError(() => of(requests.find((request) => request.id === id) ?? null).pipe(delay(120))),
    );
  }

  updateRequestStatus(id: string, status: RequestStatus): Observable<ConsultationRequestAdmin> {
    return this.http.patch<ConsultationRequestAdmin>(`/api/admin/requests/${id}/status`, { status }).pipe(
      catchError(() => {
        const request = requests.find((item) => item.id === id);
        if (!request) {
          return throwError(() => new Error('Request not found'));
        }
        request.status = status;
        return of(request).pipe(delay(150));
      }),
    );
  }

  getContent(type: ContentType): Observable<ContentItem[]> {
    return this.withFallback(this.http.get<ContentItem[]>(`/api/admin/${type}`), contentItems[type]);
  }

  getHomeContent(): Observable<AdminHomeContent> {
    return this.withFallback(this.http.get<AdminHomeContent>('/api/admin/home-content'), homeContent);
  }

  saveHomeContent(payload: AdminHomeContent): Observable<AdminHomeContent> {
    return this.http.patch<AdminHomeContent>('/api/admin/home-content', { content: payload }).pipe(
      catchError(() => {
        Object.assign(homeContent, payload);
        return of(homeContent).pipe(delay(160));
      }),
    );
  }

  deleteContent(type: ContentType, id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/${type}/${id}`).pipe(
      catchError(() => {
        const index = contentItems[type].findIndex((item) => item.id === id);
        if (index >= 0) {
          contentItems[type].splice(index, 1);
        }
        return of(void 0).pipe(delay(150));
      }),
    );
  }

  getLocalizations(): Observable<LocalizationDictionaries> {
    return this.http.get<LocalizationDictionaries>('/api/admin/localizations');
  }

  saveLocalization(language: LocalizationLanguage, dictionary: Record<string, unknown>): Observable<{ language: LocalizationLanguage; dictionary: Record<string, unknown> }> {
    return this.http.patch<{ language: LocalizationLanguage; dictionary: Record<string, unknown> }>(`/api/admin/localizations/${language}`, { dictionary });
  }

  getContacts(): Observable<ContactAdminSettings> {
    return this.withFallback(this.http.get<ContactAdminSettings>('/api/admin/contacts'), contacts);
  }

  saveContacts(payload: ContactAdminSettings): Observable<ContactAdminSettings> {
    return this.http.patch<ContactAdminSettings>('/api/admin/contacts', payload).pipe(
      catchError(() => {
        Object.assign(contacts, payload);
        return of(contacts).pipe(delay(160));
      }),
    );
  }

  getSeoSettings(): Observable<SeoAdminSettings[]> {
    return this.withFallback(this.http.get<SeoAdminSettings[]>('/api/admin/seo'), seo);
  }

  saveSeoSettings(payload: SeoAdminSettings[]): Observable<SeoAdminSettings[]> {
    return this.http.put<SeoAdminSettings[]>('/api/admin/seo', payload).pipe(catchError(() => of(payload).pipe(delay(160))));
  }

  getMedia(): Observable<MediaFileAdmin[]> {
    return this.withFallback(this.http.get<MediaFileAdmin[]>('/api/admin/media'), media);
  }

  uploadMedia(file: File): Observable<MediaFileAdmin> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaFileAdmin>('/api/admin/media', formData).pipe(
      catchError(() => {
        const uploaded: MediaFileAdmin = {
          id: crypto.randomUUID(),
          name: file.name,
          url: URL.createObjectURL(file),
          size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
          uploadedAt: new Date().toISOString(),
        };
        media.unshift(uploaded);
        return of(uploaded).pipe(delay(220));
      }),
    );
  }

  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/media/${id}`).pipe(
      catchError(() => {
        const index = media.findIndex((file) => file.id === id);
        if (index >= 0) {
          media.splice(index, 1);
        }
        return of(void 0).pipe(delay(150));
      }),
    );
  }

  private upsertService(payload: AdminServiceItem): AdminServiceItem {
    const saved: AdminServiceItem = {
      ...payload,
      id: payload.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    const index = services.findIndex((service) => service.id === saved.id);
    if (index >= 0) {
      services[index] = saved;
    } else {
      services.unshift(saved);
    }
    return saved;
  }

  private withFallback<T>(request$: Observable<T>, fallback: T): Observable<T> {
    return request$.pipe(
      map((value) => value ?? fallback),
      catchError(() => of(fallback).pipe(delay(120))),
    );
  }
}
