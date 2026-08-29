CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');
CREATE TYPE "ConsultationStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

CREATE TABLE "Page" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "intro" TEXT,
  "body" TEXT,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PageSection" (
  "id" TEXT NOT NULL,
  "pageId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "title" TEXT,
  "subtitle" TEXT,
  "content" JSONB,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PageSection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Service" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  "includes" JSONB,
  "icon" TEXT,
  "imageUrl" TEXT,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Benefit" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Statistic" (
  "id" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkStep" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WorkStep_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Testimonial" (
  "id" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "authorRole" TEXT,
  "text" TEXT NOT NULL,
  "isDemo" BOOLEAN NOT NULL DEFAULT false,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FAQ" (
  "id" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactSettings" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "workingHours" TEXT NOT NULL,
  "telegram" TEXT,
  "mapUrl" TEXT,
  "translations" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConsultationRequest" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "company" TEXT,
  "serviceId" TEXT,
  "message" TEXT,
  "consent" BOOLEAN NOT NULL,
  "status" "ConsultationStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConsultationRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaFile" (
  "id" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SeoSettings" (
  "id" TEXT NOT NULL,
  "pageSlug" TEXT,
  "serviceId" TEXT,
  "metaTitle" TEXT NOT NULL,
  "metaDescription" TEXT NOT NULL,
  "ogImageUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE INDEX "Page_status_sortOrder_idx" ON "Page"("status", "sortOrder");
CREATE UNIQUE INDEX "PageSection_pageId_key_key" ON "PageSection"("pageId", "key");
CREATE INDEX "PageSection_status_sortOrder_idx" ON "PageSection"("status", "sortOrder");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE INDEX "Service_status_sortOrder_idx" ON "Service"("status", "sortOrder");
CREATE INDEX "Benefit_status_sortOrder_idx" ON "Benefit"("status", "sortOrder");
CREATE INDEX "Statistic_status_sortOrder_idx" ON "Statistic"("status", "sortOrder");
CREATE INDEX "WorkStep_status_sortOrder_idx" ON "WorkStep"("status", "sortOrder");
CREATE INDEX "Testimonial_status_sortOrder_idx" ON "Testimonial"("status", "sortOrder");
CREATE INDEX "FAQ_status_sortOrder_idx" ON "FAQ"("status", "sortOrder");
CREATE INDEX "ConsultationRequest_status_createdAt_idx" ON "ConsultationRequest"("status", "createdAt");
CREATE INDEX "ConsultationRequest_email_idx" ON "ConsultationRequest"("email");
CREATE INDEX "ConsultationRequest_phone_idx" ON "ConsultationRequest"("phone");
CREATE INDEX "MediaFile_createdAt_idx" ON "MediaFile"("createdAt");
CREATE UNIQUE INDEX "SeoSettings_serviceId_key" ON "SeoSettings"("serviceId");
CREATE UNIQUE INDEX "SeoSettings_pageSlug_key" ON "SeoSettings"("pageSlug");
CREATE INDEX "SeoSettings_pageSlug_idx" ON "SeoSettings"("pageSlug");

ALTER TABLE "PageSection" ADD CONSTRAINT "PageSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConsultationRequest" ADD CONSTRAINT "ConsultationRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SeoSettings" ADD CONSTRAINT "SeoSettings_pageSlug_fkey" FOREIGN KEY ("pageSlug") REFERENCES "Page"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeoSettings" ADD CONSTRAINT "SeoSettings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
