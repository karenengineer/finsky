import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../shared/language-switcher/language-switcher';
import { AuthService } from '../../core/auth/auth.service';

@Component({ selector: 'app-admin', imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcherComponent], templateUrl: './admin.html', styleUrl: './admin.scss' })
export class AdminComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly section = computed(() => this.route.snapshot.paramMap.get('section') ?? 'overview');
  readonly initials = computed(() => {
    const user = this.auth.currentUser();
    return user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` : '';
  });

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/admin/login']);
  }
}
