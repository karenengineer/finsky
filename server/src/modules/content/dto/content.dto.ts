import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsObject,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ConsultationStatus, PublishStatus } from '@prisma/client';

export class CreatePageDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  intro?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(PublishStatus)
  status: PublishStatus = PublishStatus.DRAFT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdatePageDto extends CreatePageDto {
  @IsOptional()
  declare slug: string;

  @IsOptional()
  declare title: string;
}

export class CreateServiceDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @IsString()
  @MaxLength(500)
  shortDescription!: string;

  @IsString()
  fullDescription!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includes?: string[];

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(PublishStatus)
  status: PublishStatus = PublishStatus.DRAFT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateServiceDto extends CreateServiceDto {
  @IsOptional()
  declare title: string;

  @IsOptional()
  declare slug: string;

  @IsOptional()
  declare shortDescription: string;

  @IsOptional()
  declare fullDescription: string;
}

export class CreateSimpleContentDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(PublishStatus)
  status: PublishStatus = PublishStatus.DRAFT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateSimpleContentDto extends CreateSimpleContentDto {
  @IsOptional()
  declare title: string;

  @IsOptional()
  declare description: string;
}

export class CreateTestimonialDto {
  @IsString()
  authorName!: string;

  @IsOptional()
  @IsString()
  authorRole?: string;

  @IsString()
  text!: string;

  @IsOptional()
  @IsBoolean()
  isDemo = false;

  @IsOptional()
  @IsEnum(PublishStatus)
  status: PublishStatus = PublishStatus.DRAFT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder = 0;
}

export class UpdateTestimonialDto extends CreateTestimonialDto {
  @IsOptional()
  declare authorName: string;

  @IsOptional()
  declare text: string;
}

export class CreateFaqDto {
  @IsString()
  question!: string;

  @IsString()
  answer!: string;

  @IsOptional()
  @IsEnum(PublishStatus)
  status: PublishStatus = PublishStatus.DRAFT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder = 0;
}

export class UpdateFaqDto extends CreateFaqDto {
  @IsOptional()
  declare question: string;

  @IsOptional()
  declare answer: string;
}

export class ContactSettingsDto {
  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  address!: string;

  @IsString()
  workingHours!: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsString()
  mapUrl?: string;
}

export class CreateConsultationRequestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(6)
  phone!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsBoolean()
  consent!: boolean;
}

export class UpdateConsultationStatusDto {
  @IsEnum(ConsultationStatus)
  status!: ConsultationStatus;
}

export class SeoSettingsDto {
  @IsOptional()
  @IsString()
  pageSlug?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsString()
  metaTitle!: string;

  @IsString()
  metaDescription!: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  ogImageUrl?: string;
}

export class HomeContentDto {
  @IsObject()
  content!: Record<string, unknown>;
}
