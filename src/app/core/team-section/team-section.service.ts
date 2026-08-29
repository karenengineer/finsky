import { Injectable, signal } from '@angular/core';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../i18n/localization.types';
import { TeamSectionConfig, TeamSectionContent } from './team-section.models';

const STORAGE_KEY = 'finkeep.teamSection';

@Injectable({ providedIn: 'root' })
export class TeamSectionService {
  readonly config = signal<TeamSectionConfig | null>(null);
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.initialize();
  }

  save(config: TeamSectionConfig): void {
    const normalized: TeamSectionConfig = {
      ...config,
      overlayOpacity: Math.min(0.9, Math.max(0.25, config.overlayOpacity)),
      sortOrder: Math.max(0, config.sortOrder),
    };
    this.config.set(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    void this.initialize(true);
  }

  private async initialize(force = false): Promise<void> {
    if (!force) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          this.config.set(JSON.parse(saved) as TeamSectionConfig);
          return;
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }

    const entries = await Promise.all(
      SUPPORTED_LANGUAGES.map(async (language) => {
        const response = await fetch(`/assets/i18n/${language}.json`);
        const dictionary = (await response.json()) as {
          home: { team: TeamSectionContent };
        };
        return [language, dictionary.home.team] as const;
      }),
    );

    this.config.set({
      isVisible: true,
      backgroundImageUrl: '/assets/images/team-background.png',
      overlayOpacity: 0.7,
      ctaLink: '/about',
      sortOrder: 5,
      content: Object.fromEntries(entries) as Record<LanguageCode, TeamSectionContent>,
    });
  }
}
