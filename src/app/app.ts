import { Title } from '@angular/platform-browser';
import { Component, DestroyRef, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalizationService } from './core/i18n/localization.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly localization = inject(LocalizationService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.localization.language();
      this.updateTitle();
    });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateTitle());
  }

  private updateTitle(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const titleKey = route.data['titleKey'] as string | undefined;
    if (titleKey) {
      this.title.setTitle(this.localization.translate(titleKey));
    }
  }
}
