import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  template: `
    <div class="min-h-screen bg-white text-premium-ink">
      <app-header />
      <main>
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class PublicLayoutComponent {}
