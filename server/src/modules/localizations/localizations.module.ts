import { Module } from '@nestjs/common';
import { LocalizationsController } from './localizations.controller';
import { LocalizationsService } from './localizations.service';

@Module({
  controllers: [LocalizationsController],
  providers: [LocalizationsService],
})
export class LocalizationsModule {}
