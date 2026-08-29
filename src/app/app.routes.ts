import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/login/login').then((module) => module.LoginComponent),
    canActivate: [guestGuard],
    data: { titleKey: 'titles.login' },
  },
  {
    path: 'admin/access-denied',
    loadComponent: () => import('./pages/access-denied/access-denied').then((module) => module.AccessDeniedComponent),
    canActivate: [authGuard],
    data: { titleKey: 'titles.accessDenied' },
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin-users/admin-users').then((module) => module.AdminUsersComponent),
    canActivate: [authGuard, roleGuard],
    data: { titleKey: 'titles.adminUsers', roles: ['SUPER_ADMIN'] },
  },
  {
    path: 'admin/team-section',
    loadComponent: () =>
      import('./pages/team-section-editor/team-section-editor').then((module) => module.TeamSectionEditorComponent),
    canActivate: [authGuard, roleGuard],
    data: { titleKey: 'titles.teamSectionEditor', roles: ['SUPER_ADMIN', 'ADMIN'] },
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/layout/admin-layout/admin-layout').then((module) => module.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/pages/dashboard/dashboard').then((module) => module.DashboardComponent),
      },
      {
        path: 'pages',
        loadComponent: () =>
          import('./admin/pages/home-content-editor/home-content-editor').then((module) => module.HomeContentEditorComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('./admin/pages/services-list/services-list').then((module) => module.ServicesListComponent),
      },
      {
        path: 'services/new',
        loadComponent: () => import('./admin/pages/service-form/service-form').then((module) => module.ServiceFormComponent),
      },
      {
        path: 'services/:id/edit',
        loadComponent: () => import('./admin/pages/service-form/service-form').then((module) => module.ServiceFormComponent),
      },
      {
        path: 'benefits',
        loadComponent: () => import('./admin/pages/content-list/content-list').then((module) => module.ContentListComponent),
        data: { contentType: 'benefits' },
      },
      {
        path: 'statistics',
        loadComponent: () => import('./admin/pages/content-list/content-list').then((module) => module.ContentListComponent),
        data: { contentType: 'statistics' },
      },
      {
        path: 'work-steps',
        loadComponent: () => import('./admin/pages/content-list/content-list').then((module) => module.ContentListComponent),
        data: { contentType: 'work-steps' },
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./admin/pages/content-list/content-list').then((module) => module.ContentListComponent),
        data: { contentType: 'testimonials' },
      },
      {
        path: 'faq',
        loadComponent: () => import('./admin/pages/content-list/content-list').then((module) => module.ContentListComponent),
        data: { contentType: 'faq' },
      },
      {
        path: 'requests',
        loadComponent: () => import('./admin/pages/requests-list/requests-list').then((module) => module.RequestsListComponent),
      },
      {
        path: 'requests/:id',
        loadComponent: () => import('./admin/pages/request-detail/request-detail').then((module) => module.RequestDetailComponent),
      },
      {
        path: 'contacts',
        loadComponent: () => import('./admin/pages/contacts-editor/contacts-editor').then((module) => module.ContactsEditorComponent),
      },
      {
        path: 'localizations',
        loadComponent: () =>
          import('./admin/pages/localizations-editor/localizations-editor').then((module) => module.LocalizationsEditorComponent),
      },
      {
        path: 'seo',
        loadComponent: () => import('./admin/pages/seo-editor/seo-editor').then((module) => module.SeoEditorComponent),
      },
      {
        path: 'media',
        loadComponent: () => import('./admin/pages/media-library/media-library').then((module) => module.MediaLibraryComponent),
      },
    ],
  },
  { path: 'login', redirectTo: 'admin/login', pathMatch: 'full' },
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
