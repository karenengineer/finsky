import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public/layout/public-layout/public-layout').then((module) => module.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./public/pages/home-page/home-page').then((module) => module.HomePageComponent),
        pathMatch: 'full',
      },
      {
        path: 'about',
        loadComponent: () => import('./public/pages/about-page/about-page').then((module) => module.AboutPageComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('./public/pages/services-page/services-page').then((module) => module.ServicesPageComponent),
      },
      {
        path: 'services/:slug',
        loadComponent: () =>
          import('./public/pages/service-detail-page/service-detail-page').then((module) => module.ServiceDetailPageComponent),
      },
      {
        path: 'contacts',
        loadComponent: () => import('./public/pages/contacts-page/contacts-page').then((module) => module.ContactsPageComponent),
      },
      {
        path: 'privacy',
        loadComponent: () => import('./public/pages/privacy-page/privacy-page').then((module) => module.PrivacyPageComponent),
      },
      { path: 'success', redirectTo: 'thank-you', pathMatch: 'full' },
      {
        path: 'thank-you',
        loadComponent: () => import('./public/pages/thank-you-page/thank-you-page').then((module) => module.ThankYouPageComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./public/pages/not-found-page/not-found-page').then((module) => module.NotFoundPageComponent),
      },
    ],
  },
];
