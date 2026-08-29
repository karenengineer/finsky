export type PublishStatus = 'PUBLISHED' | 'HIDDEN';
export type RequestStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
export type ContentType = 'pages' | 'benefits' | 'statistics' | 'work-steps' | 'testimonials' | 'faq';

export interface AdminDashboard {
  totalRequests: number;
  newRequests: number;
  publishedServices: number;
  testimonials: number;
  latestRequests: ConsultationRequestAdmin[];
}

export interface AdminServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  order: number;
  status: PublishStatus;
  updatedAt: string;
}

export interface ConsultationRequestAdmin {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  service: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  order: number;
  status: PublishStatus;
  updatedAt: string;
}

export interface ContactAdminSettings {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  telegram?: string;
  mapUrl?: string;
}

export interface SeoAdminSettings {
  id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
}

export interface MediaFileAdmin {
  id: string;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
}

export interface AdminHomeContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    imageUrl: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    highlights: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  team: {
    isVisible: boolean;
    backgroundImageUrl: string;
    overlayOpacity: number;
    label: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    trustPoints: string[];
  };
  sections: {
    services: { eyebrow: string; title: string; description: string; allServicesLabel: string; detailLabel: string; emptyLabel: string };
    benefits: { eyebrow: string; title: string; description: string };
    statistics: { eyebrow: string; title: string; description?: string };
    workProcess: { eyebrow: string; title: string; description: string };
    testimonials: { eyebrow: string; title: string; description?: string };
    faq: { eyebrow: string; title: string; description: string };
    consultation: {
      eyebrow: string;
      title: string;
      description: string;
      submitLabel: string;
      submittingLabel: string;
      successRedirect: string;
      consentText: string;
    };
  };
}

export type LocalizationLanguage = 'ru' | 'en' | 'hy';
export type LocalizationDictionaries = Record<LocalizationLanguage, Record<string, unknown>>;
