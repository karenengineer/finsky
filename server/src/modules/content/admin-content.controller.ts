import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AdminListQueryDto, RequestListQueryDto } from '../../common/dto/query.dto';
import { Roles } from '../../common/auth/roles.decorator';
import { ContentService } from './content.service';
import {
  ContactSettingsDto,
  CreateFaqDto,
  CreatePageDto,
  CreateServiceDto,
  CreateSimpleContentDto,
  CreateTestimonialDto,
  SeoSettingsDto,
  HomeContentDto,
  UpdateConsultationStatusDto,
  UpdateFaqDto,
  UpdatePageDto,
  UpdateServiceDto,
  UpdateSimpleContentDto,
  UpdateTestimonialDto,
} from './dto/content.dto';

@ApiTags('Admin content')
@ApiBearerAuth()
@Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
@Controller('admin')
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  @Get('dashboard')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.VIEWER)
  dashboard() {
    return this.content.dashboard();
  }

  @Get('pages')
  pages(@Query() query: AdminListQueryDto) {
    return this.content.adminPages(query);
  }

  @Get('home-content')
  homeContent() {
    return this.content.adminHomeContent();
  }

  @Patch('home-content')
  updateHomeContent(@Body() dto: HomeContentDto) {
    return this.content.updateHomeContent(dto.content);
  }

  @Post('pages')
  createPage(@Body() dto: CreatePageDto) {
    return this.content.createPage(dto);
  }

  @Patch('pages/:id')
  updatePage(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.content.updatePage(id, dto);
  }

  @Delete('pages/:id')
  deletePage(@Param('id') id: string) {
    return this.content.deletePage(id);
  }

  @Get('services')
  services(@Query() query: AdminListQueryDto) {
    return this.content.adminServices(query);
  }

  @Get('services/:id')
  service(@Param('id') id: string) {
    return this.content.adminService(id);
  }

  @Post('services')
  createService(@Body() dto: CreateServiceDto) {
    return this.content.createService(dto);
  }

  @Patch('services/:id')
  updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.content.updateService(id, dto);
  }

  @Delete('services/:id')
  deleteService(@Param('id') id: string) {
    return this.content.deleteService(id);
  }

  @Get('benefits')
  benefits(@Query() query: AdminListQueryDto) {
    return this.content.listSimple('benefit', query);
  }

  @Post('benefits')
  createBenefit(@Body() dto: CreateSimpleContentDto) {
    return this.content.createSimple('benefit', dto);
  }

  @Patch('benefits/:id')
  updateBenefit(@Param('id') id: string, @Body() dto: UpdateSimpleContentDto) {
    return this.content.updateSimple('benefit', id, dto);
  }

  @Delete('benefits/:id')
  deleteBenefit(@Param('id') id: string) {
    return this.content.deleteSimple('benefit', id);
  }

  @Get('statistics')
  statistics(@Query() query: AdminListQueryDto) {
    return this.content.listSimple('statistic', query);
  }

  @Post('statistics')
  createStatistic(@Body() dto: CreateSimpleContentDto) {
    return this.content.createSimple('statistic', dto);
  }

  @Patch('statistics/:id')
  updateStatistic(@Param('id') id: string, @Body() dto: UpdateSimpleContentDto) {
    return this.content.updateSimple('statistic', id, dto);
  }

  @Delete('statistics/:id')
  deleteStatistic(@Param('id') id: string) {
    return this.content.deleteSimple('statistic', id);
  }

  @Get('work-steps')
  workSteps(@Query() query: AdminListQueryDto) {
    return this.content.listSimple('workStep', query);
  }

  @Post('work-steps')
  createWorkStep(@Body() dto: CreateSimpleContentDto) {
    return this.content.createSimple('workStep', dto);
  }

  @Patch('work-steps/:id')
  updateWorkStep(@Param('id') id: string, @Body() dto: UpdateSimpleContentDto) {
    return this.content.updateSimple('workStep', id, dto);
  }

  @Delete('work-steps/:id')
  deleteWorkStep(@Param('id') id: string) {
    return this.content.deleteSimple('workStep', id);
  }

  @Get('testimonials')
  testimonials(@Query() query: AdminListQueryDto) {
    return this.content.listTestimonials(query);
  }

  @Post('testimonials')
  createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.content.createTestimonial(dto);
  }

  @Patch('testimonials/:id')
  updateTestimonial(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.content.updateTestimonial(id, dto);
  }

  @Delete('testimonials/:id')
  deleteTestimonial(@Param('id') id: string) {
    return this.content.deleteTestimonial(id);
  }

  @Get('faq')
  faq(@Query() query: AdminListQueryDto) {
    return this.content.listFaq(query);
  }

  @Post('faq')
  createFaq(@Body() dto: CreateFaqDto) {
    return this.content.createFaq(dto);
  }

  @Patch('faq/:id')
  updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.content.updateFaq(id, dto);
  }

  @Delete('faq/:id')
  deleteFaq(@Param('id') id: string) {
    return this.content.deleteFaq(id);
  }

  @Get('contacts')
  contacts() {
    return this.content.contacts();
  }

  @Patch('contacts')
  updateContacts(@Body() dto: ContactSettingsDto) {
    return this.content.updateContacts(dto);
  }

  @Get('consultation-requests')
  requests(@Query() query: RequestListQueryDto) {
    return this.content.listRequests(query);
  }

  @Get('requests')
  async requestAlias(@Query() query: RequestListQueryDto) {
    return (await this.content.listRequests(query)).items;
  }

  @Get('consultation-requests/:id')
  request(@Param('id') id: string) {
    return this.content.request(id);
  }

  @Get('requests/:id')
  requestDetailAlias(@Param('id') id: string) {
    return this.content.request(id);
  }

  @Patch('consultation-requests/:id')
  updateRequest(@Param('id') id: string, @Body() dto: UpdateConsultationStatusDto) {
    return this.content.updateRequestStatus(id, dto);
  }

  @Patch('requests/:id/status')
  updateRequestAlias(@Param('id') id: string, @Body() dto: UpdateConsultationStatusDto) {
    return this.content.updateRequestStatus(id, dto);
  }

  @Get('seo')
  seo() {
    return this.content.seoList();
  }

  @Post('seo')
  createSeo(@Body() dto: SeoSettingsDto) {
    return this.content.createSeo(dto);
  }

  @Put('seo')
  saveSeoBulk(@Body() dto: SeoSettingsDto[]) {
    return this.content.saveSeoBulk(dto);
  }

  @Patch('seo/:id')
  updateSeo(@Param('id') id: string, @Body() dto: SeoSettingsDto) {
    return this.content.updateSeo(id, dto);
  }

  @Delete('seo/:id')
  deleteSeo(@Param('id') id: string) {
    return this.content.deleteSeo(id);
  }
}
