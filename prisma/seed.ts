import { AdminRole, AdminStatus, PrismaClient, PublishStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await seedAdmin();
  await seedContent();
  console.log('Seed completed.');
}

async function seedAdmin(): Promise<void> {
  const email = process.env['ADMIN_EMAIL']?.trim().toLowerCase();
  const password = process.env['ADMIN_PASSWORD'];
  const firstName = process.env['ADMIN_FIRST_NAME']?.trim();
  const lastName = process.env['ADMIN_LAST_NAME']?.trim();

  if (!email || !password || !firstName || !lastName) {
    throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, and ADMIN_LAST_NAME are required.');
  }

  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new Error('ADMIN_PASSWORD must contain at least 8 characters, one letter, and one number.');
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash: await hash(password, 12),
        firstName,
        lastName,
        role: AdminRole.SUPER_ADMIN,
        status: AdminStatus.ACTIVE,
      },
    });
    console.log(`Created initial SUPER_ADMIN: ${email}`);
  }
}

async function seedContent(): Promise<void> {
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Бухгалтерия и налоговые консультации, которые дают бизнесу спокойствие',
      intro: 'Помогаем предпринимателям и компаниям вести учет, готовить отчетность и принимать финансовые решения с уверенностью.',
      body: 'FinSky работает с малым и средним бизнесом, ИП и стартапами в Yerevan, Armenia.',
      status: PublishStatus.PUBLISHED,
      sortOrder: 1,
      seoSettings: {
        create: {
          metaTitle: 'FinSky | Бухгалтерский и налоговый консалтинг',
          metaDescription: 'Бухгалтерское сопровождение и налоговые консультации для бизнеса в Yerevan, Armenia.',
        },
      },
    },
  });

  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'О компании FinSky',
      intro: 'FinSky помогает бизнесу выстроить аккуратные бухгалтерские и налоговые процессы.',
      body: 'Мы работаем с малым и средним бизнесом, индивидуальными предпринимателями и стартапами.\n\nНаш подход строится на точности, конфиденциальности и понятной коммуникации.',
      status: PublishStatus.PUBLISHED,
      sortOrder: 2,
      seoSettings: {
        create: {
          metaTitle: 'О компании | FinSky',
          metaDescription: 'О FinSky: бухгалтерский, налоговый и финансовый консалтинг для бизнеса.',
        },
      },
    },
  });

  await prisma.contactSettings.upsert({
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

  const service = await prisma.service.upsert({
    where: { slug: 'accounting-support' },
    update: {},
    create: {
      title: 'Бухгалтерское сопровождение бизнеса',
      slug: 'accounting-support',
      shortDescription: 'Ведем учет, контролируем сроки и готовим отчетность.',
      fullDescription: 'Комплексное бухгалтерское сопровождение для компаний и предпринимателей.',
      includes: ['Первичная документация', 'Ведение учета', 'Подготовка отчетности'],
      status: PublishStatus.PUBLISHED,
      sortOrder: 1,
      seoSettings: {
        create: {
          metaTitle: 'Бухгалтерское сопровождение бизнеса | FinSky',
          metaDescription: 'Профессиональное бухгалтерское сопровождение бизнеса в Yerevan, Armenia.',
        },
      },
    },
  });

  await prisma.service.upsert({
    where: { slug: 'tax-consulting' },
    update: {},
    create: {
      title: 'Налоговый консалтинг',
      slug: 'tax-consulting',
      shortDescription: 'Помогаем разобраться с налоговой нагрузкой и рисками.',
      fullDescription: 'Налоговые консультации для предпринимателей и компаний.',
      includes: ['Анализ налоговой ситуации', 'Оценка рисков', 'Практические рекомендации'],
      status: PublishStatus.PUBLISHED,
      sortOrder: 2,
    },
  });

  await prisma.benefit.upsert({
    where: { id: 'accuracy' },
    update: {},
    create: {
      id: 'accuracy',
      title: 'Точность в деталях',
      description: 'Проверяем данные, сроки и документы, чтобы учет был надежной опорой бизнеса.',
      status: PublishStatus.PUBLISHED,
      sortOrder: 1,
    },
  });

  await prisma.statistic.upsert({
    where: { id: 'city' },
    update: {},
    create: {
      id: 'city',
      value: 'Yerevan',
      label: 'локальная экспертиза для бизнеса в Армении',
      status: PublishStatus.PUBLISHED,
      sortOrder: 1,
    },
  });

  await prisma.workStep.upsert({
    where: { id: 'brief' },
    update: {},
    create: {
      id: 'brief',
      title: 'Знакомимся с задачей',
      description: 'Уточняем формат бизнеса, текущую ситуацию и приоритеты.',
      status: PublishStatus.PUBLISHED,
      sortOrder: 1,
    },
  });

  await prisma.testimonial.upsert({
    where: { id: 'demo-testimonial' },
    update: {},
    create: {
      id: 'demo-testimonial',
      authorName: 'Шаблонный пример',
      authorRole: 'Владелец бизнеса',
      text: 'Демо-отзыв для последующей замены реальным отзывом клиента.',
      isDemo: true,
      status: PublishStatus.PUBLISHED,
      sortOrder: 1,
    },
  });

  await prisma.fAQ.upsert({
    where: { id: 'remote-work' },
    update: {},
    create: {
      id: 'remote-work',
      question: 'Можно ли работать удаленно?',
      answer: 'Да, большинство процессов можно организовать дистанционно через согласованный канал обмена документами.',
      status: PublishStatus.PUBLISHED,
      sortOrder: 1,
    },
  });

  await prisma.consultationRequest.upsert({
    where: { id: 'demo-request' },
    update: {},
    create: {
      id: 'demo-request',
      name: 'Анна Волкова',
      phone: '+374 91 000 111',
      email: 'anna@example.com',
      company: 'Meridian LLC',
      serviceId: service.id,
      message: 'Нужно передать бухгалтерию на сопровождение со следующего месяца.',
      consent: true,
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
