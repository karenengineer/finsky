import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../core/admin-api.service';
import { ToastService } from '../../core/toast.service';

type SeoFormGroup = FormGroup<{
  id: FormControl<string>;
  page: FormControl<string>;
  metaTitle: FormControl<string>;
  metaDescription: FormControl<string>;
  ogImageUrl: FormControl<string>;
}>;

@Component({
  selector: 'app-admin-seo-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-3xl font-bold text-navy">SEO settings</h2>
    <p class="mt-1 text-premium-muted">Meta title, description и Open Graph image для основных страниц.</p>

    <form class="mt-6 grid gap-5" [formGroup]="form" (ngSubmit)="save()">
      <div formArrayName="items" class="grid gap-5">
        @for (item of seoItems(); track item.controls.id.value; let index = $index) {
          <section class="grid gap-4 rounded-[1.5rem] bg-white p-6 shadow-card" [formGroupName]="index">
            <h3 class="text-xl font-bold text-navy">{{ item.controls.page.value }}</h3>
            <input class="min-h-12 rounded-2xl border border-premium-line px-4" formControlName="metaTitle" placeholder="Meta title" />
            <textarea class="min-h-28 rounded-2xl border border-premium-line px-4 py-3" formControlName="metaDescription" placeholder="Meta description"></textarea>
            <input class="min-h-12 rounded-2xl border border-premium-line px-4" formControlName="ogImageUrl" placeholder="Open Graph image URL" />
          </section>
        }
      </div>
      <button type="submit" class="inline-flex min-h-12 w-fit items-center rounded-full bg-navy px-6 text-sm font-bold text-white">Save SEO</button>
    </form>
  `,
})
export class SeoEditorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    items: this.fb.array([
      this.fb.nonNullable.group({
        id: [''],
        page: [''],
        metaTitle: ['', Validators.required],
        metaDescription: ['', Validators.required],
        ogImageUrl: [''],
      }),
    ]),
  });

  protected get items(): FormArray<SeoFormGroup> {
    return this.form.controls.items;
  }

  protected seoItems(): SeoFormGroup[] {
    return this.items.controls;
  }

  constructor() {
    this.api
      .getSeoSettings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((settings) => {
        this.items.clear();
        for (const item of settings) {
          this.items.push(
            this.fb.nonNullable.group({
              id: [item.id],
              page: [item.page],
              metaTitle: [item.metaTitle, Validators.required],
              metaDescription: [item.metaDescription, Validators.required],
              ogImageUrl: [item.ogImageUrl],
            }),
          );
        }
      });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.saveSeoSettings(this.form.getRawValue().items).subscribe(() => this.toast.show('SEO settings saved'));
  }
}
