import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { IsObject } from 'class-validator';
import { Roles } from '../../common/auth/roles.decorator';
import { LocalizationsService, SupportedLocalization } from './localizations.service';

class UpdateLocalizationDto {
  @IsObject()
  dictionary!: Record<string, unknown>;
}

@ApiTags('Admin localizations')
@ApiBearerAuth()
@Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
@Controller('admin/localizations')
export class LocalizationsController {
  constructor(private readonly localizations: LocalizationsService) {}

  @Get()
  list() {
    return this.localizations.list();
  }

  @Patch(':language')
  update(@Param('language') language: SupportedLocalization, @Body() dto: UpdateLocalizationDto) {
    return this.localizations.update(language, dto.dictionary);
  }
}
