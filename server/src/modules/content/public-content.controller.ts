import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/auth/public.decorator';
import { ContentService } from './content.service';
import { CreateConsultationRequestDto } from './dto/content.dto';

@ApiTags('Public')
@Public()
@Controller('public')
export class PublicContentController {
  constructor(private readonly content: ContentService) {}

  @Get('home')
  home() {
    return this.content.publicHome();
  }

  @Get('pages/:slug')
  page(@Param('slug') slug: string) {
    return this.content.publicPage(slug);
  }

  @Get('services')
  services() {
    return this.content.publicServices();
  }

  @Get('services/:slug')
  service(@Param('slug') slug: string) {
    return this.content.publicService(slug);
  }

  @Get('benefits')
  benefits() {
    return this.content.publicBenefits();
  }

  @Get('statistics')
  statistics() {
    return this.content.publicStatistics();
  }

  @Get('work-steps')
  workSteps() {
    return this.content.publicWorkSteps();
  }

  @Get('testimonials')
  testimonials() {
    return this.content.publicTestimonials();
  }

  @Get('faq')
  faq() {
    return this.content.publicFaq();
  }

  @Get('contacts')
  contacts() {
    return this.content.contacts();
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('consultation-requests')
  createRequest(@Body() dto: CreateConsultationRequestDto) {
    return this.content.createConsultationRequest(dto);
  }
}
