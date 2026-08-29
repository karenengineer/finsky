import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;
  private readonly publicBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.uploadDir = join(process.cwd(), config.get<string>('UPLOAD_DIR', 'public/uploads'));
    this.publicBaseUrl = config.get<string>('PUBLIC_BASE_URL', 'http://localhost:3000');
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  list() {
    return this.prisma.mediaFile
      .findMany({ orderBy: { createdAt: 'desc' } })
      .then((files) => files.map((file) => this.mapFile(file)));
  }

  async save(file: Express.Multer.File) {
    const saved = await this.prisma.mediaFile.create({
      data: {
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: `${this.publicBaseUrl}/uploads/${file.filename}`,
      },
    });
    return this.mapFile(saved);
  }

  async delete(id: string): Promise<void> {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException('Media file not found');
    }

    await this.prisma.mediaFile.delete({ where: { id } });
    const filePath = join(this.uploadDir, file.fileName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  private mapFile(file: { id: string; originalName: string; fileName: string; mimeType: string; size: number; url: string; createdAt: Date }) {
    return {
      id: file.id,
      name: file.originalName,
      fileName: file.fileName,
      mimeType: file.mimeType,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      sizeBytes: file.size,
      url: file.url,
      uploadedAt: file.createdAt,
    };
  }
}
