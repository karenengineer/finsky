# FinKeep

Angular public website and administration UI with a production-ready NestJS, PostgreSQL, and Prisma REST API.

## Requirements

- Node.js 22+
- Docker Desktop or PostgreSQL 16+
- npm

## Environment

Create `.env` from `.env.example` and set:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finkeep?schema=public"
PORT=3000
WEB_ORIGIN="http://localhost:4200"
JWT_ACCESS_SECRET="at-least-32-random-characters"
JWT_REFRESH_SECRET="another-at-least-32-random-characters"
JWT_ACCESS_TTL="15m"
JWT_REFRESH_TTL_DAYS=7
COOKIE_SECURE=false
PUBLIC_BASE_URL="http://localhost:3000"
UPLOAD_DIR="public/uploads"
MAX_UPLOAD_SIZE_MB=5

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="ChangeMe123"
ADMIN_FIRST_NAME="System"
ADMIN_LAST_NAME="Administrator"
```

Use `COOKIE_SECURE=true` in production over HTTPS. Use independent, random JWT secrets.

## First setup

```bash
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Open:

- Website: `http://localhost:4200`
- Admin login: `http://localhost:4200/admin/login`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

The seed is idempotent. If `ADMIN_EMAIL` already exists, it does not create a duplicate.

## Authentication

- Access tokens are short-lived JWTs held only in Angular memory.
- Refresh JWTs are stored in an `HttpOnly`, `SameSite=Strict` cookie.
- Refresh sessions are hashed in PostgreSQL and rotated on every refresh.
- Angular restores a session through `/api/auth/refresh`, then validates it through `/api/auth/me`.
- Every authenticated backend request rechecks that the database user remains `ACTIVE`.
- Login errors are intentionally generic: `Invalid email or password`.
- Login is rate limited to five attempts per minute per client.

Required auth endpoints:

```text
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

## Public API

```text
GET  /api/public/home
GET  /api/public/pages/:slug
GET  /api/public/services
GET  /api/public/services/:slug
GET  /api/public/benefits
GET  /api/public/statistics
GET  /api/public/work-steps
GET  /api/public/testimonials
GET  /api/public/faq
GET  /api/public/contacts
POST /api/public/consultation-requests
```

Only records with `status = PUBLISHED` are returned from public content endpoints. Public consultation requests are rate-limited to five submissions per minute per client.

## Admin API

All admin endpoints require a Bearer access token. Refresh tokens are stored in an `HttpOnly` cookie and rotated through `/api/auth/refresh`.

```text
GET    /api/admin/dashboard

GET    /api/admin/pages
POST   /api/admin/pages
PATCH  /api/admin/pages/:id
DELETE /api/admin/pages/:id

GET    /api/admin/services
GET    /api/admin/services/:id
POST   /api/admin/services
PATCH  /api/admin/services/:id
DELETE /api/admin/services/:id

GET    /api/admin/benefits
POST   /api/admin/benefits
PATCH  /api/admin/benefits/:id
DELETE /api/admin/benefits/:id

GET    /api/admin/statistics
POST   /api/admin/statistics
PATCH  /api/admin/statistics/:id
DELETE /api/admin/statistics/:id

GET    /api/admin/work-steps
POST   /api/admin/work-steps
PATCH  /api/admin/work-steps/:id
DELETE /api/admin/work-steps/:id

GET    /api/admin/testimonials
POST   /api/admin/testimonials
PATCH  /api/admin/testimonials/:id
DELETE /api/admin/testimonials/:id

GET    /api/admin/faq
POST   /api/admin/faq
PATCH  /api/admin/faq/:id
DELETE /api/admin/faq/:id

GET    /api/admin/contacts
PATCH  /api/admin/contacts

GET    /api/admin/consultation-requests?page=1&limit=20&status=NEW&q=anna
GET    /api/admin/consultation-requests/:id
PATCH  /api/admin/consultation-requests/:id

GET    /api/admin/seo
POST   /api/admin/seo
PATCH  /api/admin/seo/:id
DELETE /api/admin/seo/:id

GET    /api/admin/media
POST   /api/admin/media
DELETE /api/admin/media/:id
```

For compatibility with the Angular admin UI, `/api/admin/requests` and `/api/admin/requests/:id` aliases are also available.

## Content localization

The database keeps first-release Russian/default fields directly on each public entity and reserves `translations Json?` for localized HY/EN/RU overrides. A future localization service can resolve `Accept-Language` by merging base fields with `translations[language]` without changing table structure.

## Upload security

Media upload accepts only JPG, PNG, WebP, and SVG files. The current limit is 5 MB per file. Files are stored under `UPLOAD_DIR` and served from `/uploads/*`; store uploads on object storage such as S3 in production.

## Roles

- `SUPER_ADMIN`: full access and admin-user management.
- `ADMIN`: content and request management.
- `VIEWER`: read-only dashboard access.

Only users with `status = ACTIVE` can authenticate. Supported statuses are `ACTIVE`, `INVITED`, `BLOCKED`, and `DELETED`.

The system prevents users from blocking/deleting themselves and prevents removal or demotion of the final active `SUPER_ADMIN`.

## Protecting backend routes

All NestJS routes require JWT authentication by default. Mark an endpoint public only when necessary:

```ts
@Public()
@Post('login')
login() {}
```

Restrict roles with:

```ts
@Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
@Patch('content/:id')
updateContent() {}
```

Admin-user endpoints are restricted to `SUPER_ADMIN`:

```text
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id
PATCH  /api/admin/users/:id/status
DELETE /api/admin/users/:id
```

## Protecting Angular routes

Use `authGuard` for authenticated admin routes and `roleGuard` with route data for restricted sections:

```ts
{
  path: 'admin/users',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['SUPER_ADMIN'] }
}
```

Frontend visibility is only a convenience. The NestJS guard remains the authoritative permission check.

## Commands

```bash
npm start                 # Angular with /api proxy
npm run start:api         # NestJS API
npm run start:dev         # Angular and NestJS together
npm run build:all         # Production builds
npm test -- --watch=false # Angular unit tests
npm run prisma:migrate    # Create a development migration
npm run prisma:deploy     # Apply committed migrations
npm run prisma:seed       # Create the first SUPER_ADMIN
```
