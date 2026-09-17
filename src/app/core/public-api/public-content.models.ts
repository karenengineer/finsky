export type LanguageCode = 'hy' | 'en' | 'ru';

export type ApiStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface ApiState<T> {
  status: ApiStatus;
  data: T | null;
  error: string | null;
}

export interface SeoMeta {
  title: string;
  description: string;
  h1?: string;
}

export interface PageData {
  slug: string;
  title: string;
  intro: string;
  body: string[];
  seo: SeoMeta;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  highlights: string[];
}

export interface ServiceSummary {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  order: number;
}

export interface ServiceDetail extends ServiceSummary {
  fullDescription: string;
  includes: string[];
  seo: SeoMeta;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
  order: number;
}

export interface WorkStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  isDemo: boolean;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface AboutPreview {
  imageUrl: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface TeamTrustSection {
  isVisible: boolean;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
  overlayOpacity: number;
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  trustPoints: string[];
}

export interface ContactSettings {
  seo: SeoMeta;
  title: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  mapUrl?: string;
}

export interface SectionHeadingContent {
  eyebrow: string;
  title: string;
  description?: string;
}

export interface HomeSectionCopy {
  services: SectionHeadingContent & {
    allServicesLabel: string;
    detailLabel: string;
    emptyLabel: string;
  };
  benefits: SectionHeadingContent;
  statistics: SectionHeadingContent;
  workProcess: SectionHeadingContent;
  testimonials: SectionHeadingContent;
  faq: SectionHeadingContent;
  consultation: SectionHeadingContent & {
    submitLabel: string;
    consentText: string;
  };
}

export interface PublicHomeContent {
  seo: SeoMeta;
  hero: HeroContent;
  services: ServiceSummary[];
  benefits: Benefit[];
  about: AboutPreview;
  team: TeamTrustSection;
  statistics: Statistic[];
  workSteps: WorkStep[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  contacts: ContactSettings;
  sections: HomeSectionCopy;
}
