import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export type SupportedLocalization = 'hy' | 'en' | 'ru';

const supportedLanguages: SupportedLocalization[] = ['hy', 'en', 'ru'];

@Injectable()
export class LocalizationsService {
  private readonly directory = join(process.cwd(), 'src/assets/i18n');

  async list() {
    const entries = await Promise.all(
      supportedLanguages.map(async (language) => ({
        language,
        dictionary: await this.read(language),
      })),
    );
    return Object.fromEntries(entries.map((entry) => [entry.language, entry.dictionary]));
  }

  async update(language: SupportedLocalization, dictionary: Record<string, unknown>) {
    this.assertLanguage(language);
    await writeFile(this.path(language), `${JSON.stringify(dictionary, null, 2)}\n`, 'utf8');
    return { language, dictionary };
  }

  private async read(language: SupportedLocalization): Promise<Record<string, unknown>> {
    this.assertLanguage(language);
    return JSON.parse(await readFile(this.path(language), 'utf8')) as Record<string, unknown>;
  }

  private path(language: SupportedLocalization): string {
    return join(this.directory, `${language}.json`);
  }

  private assertLanguage(language: string): asserts language is SupportedLocalization {
    if (!supportedLanguages.includes(language as SupportedLocalization)) {
      throw new BadRequestException('Unsupported language');
    }
  }
}
