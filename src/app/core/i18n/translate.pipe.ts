import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocalizationService } from './localization.service';
import { TranslationParams } from './localization.types';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly localization = inject(LocalizationService);

  transform(key: string, params?: TranslationParams): string {
    this.localization.language();
    return this.localization.translate(key, params);
  }
}
