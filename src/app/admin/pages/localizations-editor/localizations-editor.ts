import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/admin-api.service';
import { LocalizationDictionaries, LocalizationLanguage } from '../../core/admin.models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-admin-localizations-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-navy">Localizations</h2>
      <p class="mt-1 text-premium-muted">Edit JSON dictionaries for Russian, English, and Armenian UI text. Keep valid JSON structure.</p>
    </div>

    <div class="mb-5 flex flex-wrap gap-2">
      @for (language of languages; track language) {
        <button
          type="button"
          class="rounded-full border px-5 py-2 text-sm font-bold"
          [class.bg-navy]="activeLanguage() === language"
          [class.text-white]="activeLanguage() === language"
          [class.border-navy]="activeLanguage() === language"
          [class.border-premium-line]="activeLanguage() !== language"
          [class.text-navy]="activeLanguage() !== language"
          (click)="activeLanguage.set(language)"
        >
          {{ language.toUpperCase() }}
        </button>
      }
    </div>

    @if (loading()) {
      <div class="rounded-[1.5rem] bg-white p-8 text-premium-muted shadow-card">Loading dictionaries...</div>
    } @else {
      <section class="grid gap-4 rounded-[1.5rem] bg-white p-6 shadow-card">
        <textarea
          class="min-h-[560px] rounded-2xl border border-premium-line bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-50 outline-none focus:border-premium-gold"
          [(ngModel)]="editorText"
          spellcheck="false"
        ></textarea>
        @if (jsonError()) {
          <p class="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{{ jsonError() }}</p>
        }
        <button type="button" class="inline-flex min-h-12 w-fit items-center rounded-full bg-navy px-6 text-sm font-bold text-white" [disabled]="saving()" (click)="save()">
          {{ saving() ? 'Saving...' : 'Save localization' }}
        </button>
      </section>
    }
  `,
})
export class LocalizationsEditorComponent {
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly languages: LocalizationLanguage[] = ['ru', 'en', 'hy'];
  protected readonly activeLanguage = signal<LocalizationLanguage>('ru');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly jsonError = signal<string | null>(null);
  private readonly dictionaries = signal<LocalizationDictionaries | null>(null);
  protected editorText = '{}';

  constructor() {
    effect(() => {
      const dictionaries = this.dictionaries();
      if (!dictionaries) {
        return;
      }
      this.editorText = JSON.stringify(dictionaries[this.activeLanguage()], null, 2);
      this.jsonError.set(null);
    });

    this.api
      .getLocalizations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dictionaries) => {
          this.dictionaries.set(dictionaries);
          this.loading.set(false);
        },
        error: () => {
          this.jsonError.set('Could not load localization files.');
          this.loading.set(false);
        },
      });
  }

  protected save(): void {
    let dictionary: Record<string, unknown>;
    try {
      dictionary = JSON.parse(this.editorText) as Record<string, unknown>;
      this.jsonError.set(null);
    } catch {
      this.jsonError.set('Invalid JSON. Fix syntax before saving.');
      return;
    }

    this.saving.set(true);
    this.api.saveLocalization(this.activeLanguage(), dictionary).subscribe({
      next: () => {
        this.dictionaries.update((current) =>
          current ? { ...current, [this.activeLanguage()]: dictionary } : current,
        );
        this.saving.set(false);
        this.toast.show('Localization saved');
      },
      error: () => {
        this.saving.set(false);
        this.toast.show('Could not save localization', 'error');
      },
    });
  }
}
