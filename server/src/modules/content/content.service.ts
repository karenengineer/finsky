import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConsultationStatus, Prisma, PublishStatus } from '@prisma/client';
import { AdminListQueryDto, RequestListQueryDto } from '../../common/dto/query.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { sanitizeOptionalText, sanitizeText } from '../../common/utils/sanitize';
import {
  ContactSettingsDto,
  CreateConsultationRequestDto,
  CreateFaqDto,
  CreatePageDto,
  CreateServiceDto,
  CreateSimpleContentDto,
  CreateTestimonialDto,
  SeoSettingsDto,
  UpdateConsultationStatusDto,
  UpdateFaqDto,
  UpdatePageDto,
  UpdateServiceDto,
  UpdateSimpleContentDto,
  UpdateTestimonialDto,
} from './dto/content.dto';

type SimpleEntity = 'benefit' | 'statistic' | 'workStep';
type SimplePayload = CreateSimpleContentDto | UpdateSimpleContentDto;

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [totalRequests, newRequests, publishedServices, testimonials, latestRequests] =
      await this.prisma.$transaction([
        this.prisma.consultationRequest.count(),
        this.prisma.consultationRequest.count({ where: { status: ConsultationStatus.NEW } }),
        this.prisma.service.count({ where: { status: PublishStatus.PUBLISHED } }),
        this.prisma.testimonial.count(),
        this.prisma.consultationRequest.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { service: { select: { title: true } } },
        }),
      ]);

    return {
      totalRequests,
      newRequests,
      publishedServices,
      testimonials,
      latestRequests: latestRequests.map((request) => this.mapRequest(request)),
    };
  }

  async publicHome() {
    const [home, services, benefits, statistics, workSteps, testimonials, faq, contacts] =
      await Promise.all([
        this.publicPage('home').catch(() => null),
        this.publicServices(),
        this.publicBenefits(),
        this.publicStatistics(),
        this.publicWorkSteps(),
        this.publicTestimonials(),
        this.publicFaq(),
        this.contacts(),
      ]);
    const editable = await this.adminHomeContent();

    return {
      seo: home?.seo ?? {
        title: 'FinSky | Бухгалтерский и налоговый консалтинг',
        description: 'Бухгалтерское сопровождение и налоговые консультации для бизнеса.',
      },
      hero: editable.hero ?? {
        eyebrow: 'FinSky · Yerevan, Armenia',
        title: home?.title ?? 'Бухгалтерия и налоговые консультации для бизнеса',
        description: home?.intro ?? 'Помогаем вести учет, сдавать отчетность и принимать финансовые решения спокойнее.',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85',
        primaryCtaLabel: 'Получить консультацию',
        primaryCtaHref: '#consultation',
        secondaryCtaLabel: 'Посмотреть услуги',
        secondaryCtaHref: '/services',
        highlights: ['Конфиденциально', 'Понятно для владельца', 'С фокусом на бизнес'],
      },
      services,
      benefits,
      about: editable.about ?? {
        eyebrow: 'О компании',
        title: 'FinSky помогает бизнесу держать финансы под контролем',
        description: 'Бухгалтерское сопровождение, налоговый консалтинг и финансовая ясность для малого и среднего бизнеса.',
        ctaLabel: 'Подробнее о компании',
        ctaHref: '/about',
      },
      team: editable.team ?? {
        isVisible: true,
        backgroundImageUrl: '/assets/images/team-background.jpg',
        overlayOpacity: 0.68,
        label: 'Наша команда',
        title: 'Экспертная команда для уверенного ведения бизнеса',
        description: 'Мы объединяем бухгалтерскую точность, налоговую экспертизу и практический подход.',
        ctaText: 'Подробнее о компании',
        ctaLink: '/about',
        trustPoints: ['Профессиональный подход', 'Конфиденциальность', 'Фокус на бизнес'],
      },
      statistics,
      workSteps,
      testimonials,
      faq,
      contacts,
      sections: editable.sections ?? this.defaultHomeContent().sections,
    };
  }

  async adminHomeContent() {
    const page = await this.ensureHomePage();
    const section = await this.prisma.pageSection.findUnique({
      where: { pageId_key: { pageId: page.id, key: 'home-content' } },
    });
    return this.isRecord(section?.content) ? section.content : this.defaultHomeContent();
  }

  async updateHomeContent(content: Record<string, unknown>) {
    const page = await this.ensureHomePage();
    const jsonContent = content as Prisma.InputJsonObject;
    const saved = await this.prisma.pageSection.upsert({
      where: { pageId_key: { pageId: page.id, key: 'home-content' } },
      update: { content: jsonContent, status: PublishStatus.PUBLISHED },
      create: {
        pageId: page.id,
        key: 'home-content',
        title: 'Home editable content',
        content: jsonContent,
        status: PublishStatus.PUBLISHED,
        sortOrder: 0,
      },
    });
    return saved.content;
  }

  async publicPage(slug: string) {
    const page = await this.prisma.page.findFirst({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: { seoSettings: true },
    });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return {
      slug: page.slug,
      title: page.title,
      intro: page.intro ?? '',
      body: page.body ? page.body.split('\n\n') : [],
      seo: {
        title: page.seoSettings?.metaTitle ?? page.title,
        description: page.seoSettings?.metaDescription ?? page.intro ?? page.title,
        h1: page.title,
      },
    };
  }

  async publicServices() {
    const services = await this.prisma.service.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return services.map((service) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      shortDescription: service.shortDescription,
      order: service.sortOrder,
    }));
  }

  async publicService(slug: string) {
    const service = await this.prisma.service.findFirst({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: { seoSettings: true },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return {
      id: service.id,
      slug: service.slug,
      title: service.title,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      includes: this.readStringArray(service.includes),
      order: service.sortOrder,
      seo: {
        title: service.seoSettings?.metaTitle ?? `${service.title} | FinSky`,
        description: service.seoSettings?.metaDescription ?? service.shortDescription,
        h1: service.title,
      },
    };
  }

  publicBenefits() {
    return this.simplePublic('benefit');
  }

  publicStatistics() {
    return this.simplePublic('statistic');
  }

  publicWorkSteps() {
    return this.simplePublic('workStep');
  }

  async publicTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async publicFaq() {
    return this.prisma.fAQ.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async adminPages(query: AdminListQueryDto) {
    return this.prisma.page.findMany({
      where: {
      OR: query.q
        ? [{ title: { contains: query.q, mode: 'insensitive' } }, { slug: { contains: query.q, mode: 'insensitive' } }]
        : undefined,
      status: query.status,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  createPage(dto: CreatePageDto) {
    return this.prisma.page.create({ data: this.cleanPage(dto) });
  }

  updatePage(id: string, dto: UpdatePageDto) {
    return this.prisma.page.update({ where: { id }, data: this.cleanPage(dto) });
  }

  deletePage(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }

  async adminServices(query: AdminListQueryDto) {
    const where: Prisma.ServiceWhereInput = {
      OR: query.q
        ? [{ title: { contains: query.q, mode: 'insensitive' } }, { slug: { contains: query.q, mode: 'insensitive' } }]
        : undefined,
      status: query.status,
    };
    const services = await this.prisma.service.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return services.map((service) => this.mapAdminService(service));
  }

  async adminService(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return this.mapAdminService(service);
  }

  createService(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: this.cleanService(dto) });
  }

  updateService(id: string, dto: UpdateServiceDto) {
    return this.prisma.service.update({ where: { id }, data: this.cleanService(dto) });
  }

  deleteService(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }

  listSimple(entity: SimpleEntity, query: AdminListQueryDto) {
    const textFilter = query.q ? { contains: query.q, mode: Prisma.QueryMode.insensitive } : undefined;
    const where = {
      OR: textFilter ? [{ title: textFilter }] : undefined,
      status: query.status,
    };
    if (entity === 'benefit') {
      return this.prisma.benefit.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
    }
    if (entity === 'statistic') {
      return this.prisma.statistic
        .findMany({
          where: {
            OR: query.q
              ? [{ value: textFilter }, { label: textFilter }]
              : undefined,
            status: query.status,
          },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        })
        .then((items) =>
          items.map((item) => ({
            id: item.id,
            title: item.value,
            description: item.label,
            sortOrder: item.sortOrder,
            order: item.sortOrder,
            status: item.status,
            updatedAt: item.updatedAt,
          })),
        );
    }
    return this.prisma.workStep.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
  }

  createSimple(entity: SimpleEntity, dto: CreateSimpleContentDto) {
    if (entity === 'benefit') {
      return this.prisma.benefit.create({ data: this.cleanSimple(dto) });
    }
    if (entity === 'statistic') {
      return this.prisma.statistic.create({ data: this.cleanStatistic(dto) });
    }
    return this.prisma.workStep.create({ data: this.cleanWorkStep(dto) });
  }

  updateSimple(entity: SimpleEntity, id: string, dto: UpdateSimpleContentDto) {
    if (entity === 'benefit') {
      return this.prisma.benefit.update({ where: { id }, data: this.cleanSimple(dto) });
    }
    if (entity === 'statistic') {
      return this.prisma.statistic.update({ where: { id }, data: this.cleanStatistic(dto) });
    }
    return this.prisma.workStep.update({ where: { id }, data: this.cleanWorkStep(dto) });
  }

  deleteSimple(entity: SimpleEntity, id: string) {
    if (entity === 'benefit') {
      return this.prisma.benefit.delete({ where: { id } });
    }
    if (entity === 'statistic') {
      return this.prisma.statistic.delete({ where: { id } });
    }
    return this.prisma.workStep.delete({ where: { id } });
  }

  listTestimonials(query: AdminListQueryDto) {
    return this.prisma.testimonial.findMany({
      where: {
      OR: query.q ? [{ authorName: { contains: query.q, mode: 'insensitive' } }, { text: { contains: query.q, mode: 'insensitive' } }] : undefined,
      status: query.status,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  createTestimonial(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data: this.cleanTestimonial(dto) });
  }

  updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    return this.prisma.testimonial.update({ where: { id }, data: this.cleanTestimonial(dto) });
  }

  deleteTestimonial(id: string) {
    return this.prisma.testimonial.delete({ where: { id } });
  }

  listFaq(query: AdminListQueryDto) {
    return this.prisma.fAQ.findMany({
      where: {
      OR: query.q ? [{ question: { contains: query.q, mode: 'insensitive' } }, { answer: { contains: query.q, mode: 'insensitive' } }] : undefined,
      status: query.status,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  createFaq(dto: CreateFaqDto) {
    return this.prisma.fAQ.create({ data: this.cleanFaq(dto) });
  }

  updateFaq(id: string, dto: UpdateFaqDto) {
    return this.prisma.fAQ.update({ where: { id }, data: this.cleanFaq(dto) });
  }

  deleteFaq(id: string) {
    return this.prisma.fAQ.delete({ where: { id } });
  }

  async contacts() {
    return this.prisma.contactSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        phone: '+374 XX XXX XXX',
        email: 'hello@finsky.am',
        address: 'Yerevan, Armenia',
        workingHours: 'Пн-Пт, 10:00-18:00',
      },
    });
  }

  updateContacts(dto: ContactSettingsDto) {
    return this.prisma.contactSettings.upsert({
      where: { id: 'default' },
      update: {
        phone: sanitizeText(dto.phone),
        email: sanitizeText(dto.email),
        address: sanitizeText(dto.address),
        workingHours: sanitizeText(dto.workingHours),
        telegram: sanitizeOptionalText(dto.telegram),
        mapUrl: sanitizeOptionalText(dto.mapUrl),
      },
      create: {
        id: 'default',
        phone: sanitizeText(dto.phone),
        email: sanitizeText(dto.email),
        address: sanitizeText(dto.address),
        workingHours: sanitizeText(dto.workingHours),
        telegram: sanitizeOptionalText(dto.telegram),
        mapUrl: sanitizeOptionalText(dto.mapUrl),
      },
    });
  }

  async createConsultationRequest(dto: CreateConsultationRequestDto) {
    if (!dto.consent) {
      throw new BadRequestException('Consent is required');
    }
    const service = dto.serviceId
      ? await this.prisma.service.findUnique({ where: { id: dto.serviceId } })
      : dto.service
        ? await this.prisma.service.findFirst({ where: { slug: dto.service } })
        : null;
    return this.prisma.consultationRequest.create({
      data: {
        name: sanitizeText(dto.name),
        phone: sanitizeText(dto.phone),
        email: sanitizeText(dto.email).toLowerCase(),
        company: sanitizeOptionalText(dto.company),
        serviceId: service?.id,
        message: sanitizeOptionalText(dto.message),
        consent: dto.consent,
      },
      select: { id: true, status: true, createdAt: true },
    });
  }

  async listRequests(query: RequestListQueryDto) {
    const where: Prisma.ConsultationRequestWhereInput = {
      status: query.status,
      OR: query.q
        ? [
            { name: { contains: query.q, mode: 'insensitive' } },
            { phone: { contains: query.q, mode: 'insensitive' } },
            { email: { contains: query.q, mode: 'insensitive' } },
          ]
        : undefined,
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.consultationRequest.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: { service: { select: { title: true } } },
      }),
      this.prisma.consultationRequest.count({ where }),
    ]);

    return {
      items: items.map((request) => this.mapRequest(request)),
      meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async request(id: string) {
    const request = await this.prisma.consultationRequest.findUnique({
      where: { id },
      include: { service: { select: { title: true } } },
    });
    if (!request) {
      throw new NotFoundException('Consultation request not found');
    }
    return this.mapRequest(request);
  }

  async updateRequestStatus(id: string, dto: UpdateConsultationStatusDto) {
    const request = await this.prisma.consultationRequest.update({
      where: { id },
      data: { status: dto.status },
      include: { service: { select: { title: true } } },
    });
    return this.mapRequest(request);
  }

  seoList() {
    return this.prisma.seoSettings.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  createSeo(dto: SeoSettingsDto) {
    return this.prisma.seoSettings.create({ data: this.cleanSeo(dto) });
  }

  updateSeo(id: string, dto: SeoSettingsDto) {
    return this.prisma.seoSettings.update({ where: { id }, data: this.cleanSeo(dto) });
  }

  async saveSeoBulk(items: SeoSettingsDto[]) {
    return Promise.all(
      items.map((item) =>
        item.serviceId || item.pageSlug
          ? this.prisma.seoSettings.upsert({
              where: item.serviceId ? { serviceId: item.serviceId } : { pageSlug: item.pageSlug },
              update: this.cleanSeo(item),
              create: this.cleanSeo(item),
            })
          : this.prisma.seoSettings.create({ data: this.cleanSeo(item) }),
      ),
    );
  }

  deleteSeo(id: string) {
    return this.prisma.seoSettings.delete({ where: { id } });
  }

  private simplePublic(entity: SimpleEntity) {
    if (entity === 'benefit') {
      return this.prisma.benefit.findMany({
        where: { status: PublishStatus.PUBLISHED },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
    }
    if (entity === 'statistic') {
      return this.prisma.statistic.findMany({
        where: { status: PublishStatus.PUBLISHED },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
    }
    return this.prisma.workStep.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  private async paginate(
    delegate: { findMany: (args: any) => Promise<unknown[]>; count: (args: any) => Promise<number> },
    query: AdminListQueryDto,
    where: Record<string, unknown>,
  ) {
    const cleanWhere = Object.fromEntries(Object.entries(where).filter(([, value]) => value !== undefined));
    const [items, total] = await Promise.all([
      delegate.findMany({
        where: cleanWhere,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      delegate.count({ where: cleanWhere }),
    ]);
    return {
      items,
      meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  private cleanPage(dto: CreatePageDto | UpdatePageDto): Prisma.PageUncheckedCreateInput {
    return {
      slug: dto.slug ? sanitizeText(dto.slug) : undefined,
      title: dto.title ? sanitizeText(dto.title) : undefined,
      intro: sanitizeOptionalText(dto.intro),
      body: sanitizeOptionalText(dto.body),
      status: dto.status,
      sortOrder: dto.order ?? dto.sortOrder,
    } as Prisma.PageUncheckedCreateInput;
  }

  private cleanService(dto: CreateServiceDto | UpdateServiceDto): Prisma.ServiceUncheckedCreateInput {
    return {
      title: dto.title ? sanitizeText(dto.title) : undefined,
      slug: dto.slug ? sanitizeText(dto.slug) : undefined,
      shortDescription: dto.shortDescription ? sanitizeText(dto.shortDescription) : undefined,
      fullDescription: dto.fullDescription ? sanitizeText(dto.fullDescription) : undefined,
      includes: dto.includes,
      icon: sanitizeOptionalText(dto.icon),
      imageUrl: sanitizeOptionalText(dto.imageUrl),
      status: dto.status,
      sortOrder: dto.order ?? dto.sortOrder,
    } as Prisma.ServiceUncheckedCreateInput;
  }

  private cleanSimple(dto: SimplePayload): Prisma.BenefitUncheckedCreateInput {
    return {
      title: dto.title ? sanitizeText(dto.title) : undefined,
      description: dto.description ? sanitizeText(dto.description) : undefined,
      status: dto.status,
      sortOrder: dto.order ?? dto.sortOrder,
    } as Prisma.BenefitUncheckedCreateInput;
  }

  private cleanStatistic(dto: SimplePayload): Prisma.StatisticUncheckedCreateInput {
    return {
      value: dto.title ? sanitizeText(dto.title) : undefined,
      label: dto.description ? sanitizeText(dto.description) : undefined,
      status: dto.status,
      sortOrder: dto.order ?? dto.sortOrder,
    } as Prisma.StatisticUncheckedCreateInput;
  }

  private cleanWorkStep(dto: SimplePayload): Prisma.WorkStepUncheckedCreateInput {
    return {
      title: dto.title ? sanitizeText(dto.title) : undefined,
      description: dto.description ? sanitizeText(dto.description) : undefined,
      status: dto.status,
      sortOrder: dto.order ?? dto.sortOrder,
    } as Prisma.WorkStepUncheckedCreateInput;
  }

  private cleanTestimonial(dto: CreateTestimonialDto | UpdateTestimonialDto): Prisma.TestimonialUncheckedCreateInput {
    return {
      authorName: dto.authorName ? sanitizeText(dto.authorName) : undefined,
      authorRole: sanitizeOptionalText(dto.authorRole),
      text: dto.text ? sanitizeText(dto.text) : undefined,
      isDemo: dto.isDemo,
      status: dto.status,
      sortOrder: dto.sortOrder,
    } as Prisma.TestimonialUncheckedCreateInput;
  }

  private cleanFaq(dto: CreateFaqDto | UpdateFaqDto): Prisma.FAQUncheckedCreateInput {
    return {
      question: dto.question ? sanitizeText(dto.question) : undefined,
      answer: dto.answer ? sanitizeText(dto.answer) : undefined,
      status: dto.status,
      sortOrder: dto.sortOrder,
    } as Prisma.FAQUncheckedCreateInput;
  }

  private cleanSeo(dto: SeoSettingsDto): Prisma.SeoSettingsUncheckedCreateInput {
    return {
      pageSlug: sanitizeOptionalText(dto.pageSlug),
      serviceId: sanitizeOptionalText(dto.serviceId),
      metaTitle: sanitizeText(dto.metaTitle),
      metaDescription: sanitizeText(dto.metaDescription),
      ogImageUrl: sanitizeOptionalText(dto.ogImageUrl),
    };
  }

  private mapAdminService(service: { id: string; title: string; slug: string; shortDescription: string; fullDescription: string; imageUrl: string | null; sortOrder: number; status: PublishStatus; updatedAt: Date }) {
    return {
      id: service.id,
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      imageUrl: service.imageUrl ?? '',
      order: service.sortOrder,
      status: service.status === PublishStatus.PUBLISHED ? 'PUBLISHED' : 'HIDDEN',
      updatedAt: service.updatedAt,
    };
  }

  private mapRequest(request: { id: string; name: string; phone: string; email: string; company: string | null; message: string | null; status: ConsultationStatus; createdAt: Date; service?: { title: string } | null }) {
    return {
      id: request.id,
      name: request.name,
      phone: request.phone,
      email: request.email,
      company: request.company ?? '',
      service: request.service?.title ?? '',
      message: request.message ?? '',
      status: request.status,
      createdAt: request.createdAt,
    };
  }

  private readStringArray(value: Prisma.JsonValue | null): string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : [];
  }

  private async ensureHomePage() {
    return this.prisma.page.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        slug: 'home',
        title: 'Бухгалтерия и налоговые консультации для бизнеса',
        intro: 'Помогаем вести учет, сдавать отчетность и принимать финансовые решения спокойнее.',
        status: PublishStatus.PUBLISHED,
        sortOrder: 0,
      },
    });
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
  }

  private defaultHomeContent() {
    return {
      hero: {
        eyebrow: 'FinSky · Yerevan, Armenia',
        title: 'Бухгалтерия и налоговые консультации, которые дают бизнесу спокойствие',
        description: 'Помогаем предпринимателям и компаниям вести учет, готовить отчетность и принимать финансовые решения с уверенностью.',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85',
        primaryCtaLabel: 'Получить консультацию',
        primaryCtaHref: '#consultation',
        secondaryCtaLabel: 'Посмотреть услуги',
        secondaryCtaHref: '/services',
        highlights: ['Конфиденциально', 'Понятно для владельца', 'С фокусом на бизнес'],
      },
      about: {
        eyebrow: 'О компании',
        title: 'FinSky помогает бизнесу держать финансы под контролем',
        description: 'Мы сопровождаем бухгалтерские и налоговые процессы для малого и среднего бизнеса, индивидуальных предпринимателей и стартапов.',
        ctaLabel: 'Подробнее о компании',
        ctaHref: '/about',
      },
      team: {
        isVisible: true,
        backgroundImageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85',
        overlayOpacity: 0.68,
        label: 'Наша команда',
        title: 'Экспертная команда для уверенного ведения бизнеса',
        description: 'Мы объединяем бухгалтерскую точность, налоговую экспертизу и практический подход, чтобы бизнес мог сосредоточиться на развитии.',
        ctaText: 'Подробнее о компании',
        ctaLink: '/about',
        trustPoints: ['Профессиональный подход', 'Конфиденциальность', 'Консалтинг с фокусом на бизнес'],
      },
      sections: {
        services: {
          eyebrow: 'Услуги',
          title: 'Бухгалтерские процессы, которые можно передать профессионалам',
          description: 'Выберите направление, чтобы подробнее узнать о формате работы и составе услуги.',
          allServicesLabel: 'Все услуги',
          detailLabel: 'Подробнее',
          emptyLabel: 'Услуги пока не опубликованы.',
        },
        benefits: {
          eyebrow: 'Почему выбирают нас',
          title: 'Надежная опора для регулярных финансовых процессов',
          description: 'Точность, конфиденциальность и понятная коммуникация без лишнего шума.',
        },
        statistics: {
          eyebrow: 'Доверие',
          title: 'Показатели, которые можно заменить подтвержденными данными',
        },
        workProcess: {
          eyebrow: 'Как мы работаем',
          title: 'Понятный процесс без лишнего шума',
          description: 'Организуем старт и сопровождение так, чтобы бизнес продолжал работать спокойно.',
        },
        testimonials: {
          eyebrow: 'Отзывы',
          title: 'Что важно клиентам в работе с бухгалтерией',
        },
        faq: {
          eyebrow: 'FAQ',
          title: 'Частые вопросы',
          description: 'Короткие ответы на вопросы, которые обычно возникают перед стартом сотрудничества.',
        },
        consultation: {
          eyebrow: 'Заявка на консультацию',
          title: 'Обсудим, как привести бухгалтерские процессы в порядок',
          description: 'Оставьте контакты, и мы свяжемся с вами, чтобы уточнить задачу и предложить следующий шаг.',
          submitLabel: 'Отправить заявку',
          submittingLabel: 'Отправляем...',
          successRedirect: '/thank-you',
          consentText: 'Я согласен на обработку данных и ознакомлен с',
        },
      },
    };
  }
}
