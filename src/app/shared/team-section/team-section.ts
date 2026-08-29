import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizationService } from '../../core/i18n/localization.service';
import { TeamSectionService } from '../../core/team-section/team-section.service';

@Component({
  selector: 'app-team-section',
  imports: [RouterLink],
  templateUrl: './team-section.html',
  styleUrl: './team-section.scss',
})
export class TeamSectionComponent {
  private readonly teamSection = inject(TeamSectionService);
  private readonly localization = inject(LocalizationService);

  readonly config = this.teamSection.config;
  readonly content = computed(() => {
    const config = this.config();
    return config?.content[this.localization.language()] ?? null;
  });
}
