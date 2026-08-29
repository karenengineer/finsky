import { LanguageCode } from '../i18n/localization.types';

export interface TeamSectionContent {
  label: string;
  title: string;
  description: string;
  ctaText: string;
}

export interface TeamSectionConfig {
  isVisible: boolean;
  backgroundImageUrl: string;
  overlayOpacity: number;
  ctaLink: string;
  sortOrder: number;
  content: Record<LanguageCode, TeamSectionContent>;
}
