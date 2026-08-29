import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LanguageCode, LANGUAGE_OPTIONS } from '../../core/i18n/localization.types';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TeamSectionConfig } from '../../core/team-section/team-section.models';
import { TeamSectionService } from '../../core/team-section/team-section.service';
import { LanguageSwitcherComponent } from '../../shared/language-switcher/language-switcher';

@Component({
  selector: 'app-team-section-editor',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe, LanguageSwitcherComponent, UpperCasePipe],
  templateUrl: './team-section-editor.html',
  styleUrl: './team-section-editor.scss',
})
export class TeamSectionEditorComponent {
  private readonly teamSection = inject(TeamSectionService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly activeLanguage = signal<LanguageCode>('ru');
  readonly languages = LANGUAGE_OPTIONS;
  readonly saved = signal(false);
  readonly imageError = signal(false);
  readonly initials = computed(() => {
    const user = this.auth.currentUser();
    return user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` : '';
  });
  readonly form = new FormGroup({
    isVisible: new FormControl(true, { nonNullable: true }),
    backgroundImageUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    overlayOpacity: new FormControl(0.7, {
      nonNullable: true,
      validators: [Validators.min(0.25), Validators.max(0.9)],
    }),
    ctaLink: new FormControl('/about', { nonNullable: true, validators: [Validators.required] }),
    sortOrder: new FormControl(5, { nonNullable: true, validators: [Validators.min(0)] }),
    content: new FormGroup({
      hy: this.contentGroup(),
      en: this.contentGroup(),
      ru: this.contentGroup(),
    }),
  });

  constructor() {
    void this.load();
  }

  get activeContent() {
    return this.form.controls.content.controls[this.activeLanguage()];
  }

  async load(): Promise<void> {
    await this.teamSection.ready;
    const config = this.teamSection.config();
    if (config) {
      this.form.setValue(config);
    }
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.teamSection.save(this.form.getRawValue() as TeamSectionConfig);
    this.saved.set(true);
    window.setTimeout(() => this.saved.set(false), 2200);
  }

  reset(): void {
    this.teamSection.reset();
    window.setTimeout(() => void this.load(), 100);
  }

  uploadImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      this.imageError.set(true);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      this.imageError.set(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.controls.backgroundImageUrl.setValue(String(reader.result));
      this.imageError.set(false);
    };
    reader.readAsDataURL(file);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/admin/login']);
  }

  private contentGroup() {
    return new FormGroup({
      label: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      ctaText: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
