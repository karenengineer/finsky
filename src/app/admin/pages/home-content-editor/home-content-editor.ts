import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../core/admin-api.service';
import { AdminHomeContent } from '../../core/admin.models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-admin-home-content-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 class="text-3xl font-bold text-navy">Home page content</h2>
        <p class="mt-1 text-premium-muted">Edit main landing texts and images. Services, FAQ, contacts, and requests are managed in their own sections.</p>
      </div>
      <button class="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-bold text-white" type="submit" form="home-content-form" [disabled]="saving()">
        {{ saving() ? 'Saving...' : 'Save changes' }}
      </button>
    </div>

    @if (loading()) {
      <div class="rounded-[1.5rem] bg-white p-8 text-premium-muted shadow-card">Loading editable content...</div>
    } @else {
      <form id="home-content-form" class="grid gap-6" [formGroup]="form" (ngSubmit)="save()">
        <section class="grid gap-5 rounded-[1.5rem] bg-white p-6 shadow-card">
          <h3 class="text-xl font-bold text-navy">Hero</h3>
          <div class="grid gap-5 md:grid-cols-2">
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Eyebrow</span><input class="field-input" formControlName="heroEyebrow" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Hero image URL</span><input class="field-input" formControlName="heroImageUrl" /></label>
          </div>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">Title</span><textarea class="field-textarea" formControlName="heroTitle"></textarea></label>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">Description</span><textarea class="field-textarea" formControlName="heroDescription"></textarea></label>
          <div class="grid gap-5 md:grid-cols-2">
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Primary CTA</span><input class="field-input" formControlName="primaryCtaLabel" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Secondary CTA</span><input class="field-input" formControlName="secondaryCtaLabel" /></label>
          </div>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">Trust badges, comma-separated</span><input class="field-input" formControlName="heroHighlights" /></label>
        </section>

        <section class="grid gap-5 rounded-[1.5rem] bg-white p-6 shadow-card">
          <h3 class="text-xl font-bold text-navy">Section headings</h3>
          <div class="grid gap-5 md:grid-cols-2">
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Services title</span><input class="field-input" formControlName="servicesTitle" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Benefits title</span><input class="field-input" formControlName="benefitsTitle" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Work process title</span><input class="field-input" formControlName="workTitle" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">FAQ title</span><input class="field-input" formControlName="faqTitle" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Testimonials title</span><input class="field-input" formControlName="testimonialsTitle" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Form title</span><input class="field-input" formControlName="consultationTitle" /></label>
          </div>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">Form description</span><textarea class="field-textarea" formControlName="consultationDescription"></textarea></label>
        </section>

        <section class="grid gap-5 rounded-[1.5rem] bg-white p-6 shadow-card">
          <h3 class="text-xl font-bold text-navy">About and team image block</h3>
          <label class="flex items-center gap-3 text-sm font-bold text-navy"><input type="checkbox" class="size-4 accent-navy" formControlName="teamVisible" /> Show team image section</label>
          <div class="grid gap-5 md:grid-cols-2">
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">About title</span><input class="field-input" formControlName="aboutTitle" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Team background image URL</span><input class="field-input" formControlName="teamImageUrl" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Team label</span><input class="field-input" formControlName="teamLabel" /></label>
            <label class="grid gap-2"><span class="text-sm font-bold text-navy">Team CTA text</span><input class="field-input" formControlName="teamCtaText" /></label>
          </div>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">About description</span><textarea class="field-textarea" formControlName="aboutDescription"></textarea></label>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">Team title</span><textarea class="field-textarea" formControlName="teamTitle"></textarea></label>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">Team description</span><textarea class="field-textarea" formControlName="teamDescription"></textarea></label>
          <label class="grid gap-2"><span class="text-sm font-bold text-navy">Team trust points, comma-separated</span><input class="field-input" formControlName="teamTrustPoints" /></label>
        </section>
      </form>
    }
  `,
  styles: [
    `
      .field-input {
        min-height: 3rem;
        border-radius: 1rem;
        border: 1px solid var(--line);
        padding: 0 1rem;
        outline: none;
      }
      .field-textarea {
        min-height: 7rem;
        border-radius: 1rem;
        border: 1px solid var(--line);
        padding: 0.85rem 1rem;
        outline: none;
      }
      .field-input:focus,
      .field-textarea:focus {
        border-color: var(--gold);
        box-shadow: 0 0 0 3px rgba(184, 154, 99, 0.14);
      }
    `,
  ],
})
export class HomeContentEditorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  private currentContent: AdminHomeContent | null = null;

  protected readonly form = this.fb.nonNullable.group({
    heroEyebrow: ['', Validators.required],
    heroTitle: ['', Validators.required],
    heroDescription: ['', Validators.required],
    heroImageUrl: ['', Validators.required],
    primaryCtaLabel: ['', Validators.required],
    secondaryCtaLabel: ['', Validators.required],
    heroHighlights: [''],
    servicesTitle: ['', Validators.required],
    benefitsTitle: ['', Validators.required],
    workTitle: ['', Validators.required],
    faqTitle: ['', Validators.required],
    testimonialsTitle: ['', Validators.required],
    consultationTitle: ['', Validators.required],
    consultationDescription: ['', Validators.required],
    aboutTitle: ['', Validators.required],
    aboutDescription: ['', Validators.required],
    teamVisible: [true],
    teamImageUrl: ['', Validators.required],
    teamLabel: ['', Validators.required],
    teamTitle: ['', Validators.required],
    teamDescription: ['', Validators.required],
    teamCtaText: ['', Validators.required],
    teamTrustPoints: [''],
  });

  constructor() {
    this.api
      .getHomeContent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((content) => {
        this.currentContent = content;
        this.form.patchValue({
          heroEyebrow: content.hero.eyebrow,
          heroTitle: content.hero.title,
          heroDescription: content.hero.description,
          heroImageUrl: content.hero.imageUrl,
          primaryCtaLabel: content.hero.primaryCtaLabel,
          secondaryCtaLabel: content.hero.secondaryCtaLabel,
          heroHighlights: content.hero.highlights.join(', '),
          servicesTitle: content.sections.services.title,
          benefitsTitle: content.sections.benefits.title,
          workTitle: content.sections.workProcess.title,
          faqTitle: content.sections.faq.title,
          testimonialsTitle: content.sections.testimonials.title,
          consultationTitle: content.sections.consultation.title,
          consultationDescription: content.sections.consultation.description,
          aboutTitle: content.about.title,
          aboutDescription: content.about.description,
          teamVisible: content.team.isVisible,
          teamImageUrl: content.team.backgroundImageUrl,
          teamLabel: content.team.label,
          teamTitle: content.team.title,
          teamDescription: content.team.description,
          teamCtaText: content.team.ctaText,
          teamTrustPoints: content.team.trustPoints.join(', '),
        });
        this.loading.set(false);
      });
  }

  protected save(): void {
    if (this.form.invalid || !this.currentContent) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: AdminHomeContent = {
      ...this.currentContent,
      hero: {
        ...this.currentContent.hero,
        eyebrow: value.heroEyebrow,
        title: value.heroTitle,
        description: value.heroDescription,
        imageUrl: value.heroImageUrl,
        primaryCtaLabel: value.primaryCtaLabel,
        secondaryCtaLabel: value.secondaryCtaLabel,
        highlights: this.splitList(value.heroHighlights),
      },
      about: {
        ...this.currentContent.about,
        title: value.aboutTitle,
        description: value.aboutDescription,
      },
      team: {
        ...this.currentContent.team,
        isVisible: value.teamVisible,
        backgroundImageUrl: value.teamImageUrl,
        label: value.teamLabel,
        title: value.teamTitle,
        description: value.teamDescription,
        ctaText: value.teamCtaText,
        trustPoints: this.splitList(value.teamTrustPoints),
      },
      sections: {
        ...this.currentContent.sections,
        services: { ...this.currentContent.sections.services, title: value.servicesTitle },
        benefits: { ...this.currentContent.sections.benefits, title: value.benefitsTitle },
        workProcess: { ...this.currentContent.sections.workProcess, title: value.workTitle },
        faq: { ...this.currentContent.sections.faq, title: value.faqTitle },
        testimonials: { ...this.currentContent.sections.testimonials, title: value.testimonialsTitle },
        consultation: {
          ...this.currentContent.sections.consultation,
          title: value.consultationTitle,
          description: value.consultationDescription,
        },
      },
    };

    this.saving.set(true);
    this.api.saveHomeContent(payload).subscribe({
      next: (saved) => {
        this.currentContent = saved;
        this.saving.set(false);
        this.toast.show('Home content saved');
      },
      error: () => {
        this.saving.set(false);
        this.toast.show('Could not save home content', 'error');
      },
    });
  }

  private splitList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
