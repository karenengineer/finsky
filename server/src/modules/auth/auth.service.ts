import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminStatus } from '@prisma/client';
import { compare } from 'bcryptjs';
import { createHash, randomUUID } from 'crypto';
import { AuthUser, JwtPayload } from '../../common/auth/auth-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

const INVALID_LOGIN_MESSAGE = 'Invalid email or password';
const DUMMY_PASSWORD_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.0LHG.gXYVQU2aJ1R3sHDW7Xu8bXnE0i';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtl: string;
  private readonly refreshDays: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessSecret = this.requireSecret(config, 'JWT_ACCESS_SECRET');
    this.refreshSecret = this.requireSecret(config, 'JWT_REFRESH_SECRET');
    this.accessTtl = config.get<string>('JWT_ACCESS_TTL', '15m');
    this.refreshDays = config.get<number>('JWT_REFRESH_TTL_DAYS', 7);
  }

  async login(dto: LoginDto, meta: RequestMeta) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    const passwordMatches = await compare(dto.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

    if (!user || !passwordMatches || user.status !== AdminStatus.ACTIVE) {
      this.logger.warn(`Failed admin login from ${meta.ipAddress ?? 'unknown IP'}`);
      throw new UnauthorizedException(INVALID_LOGIN_MESSAGE);
    }

    const tokens = await this.issueTokens(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
      meta,
    );

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return tokens;
  }

  async refresh(refreshToken: string | undefined, meta: RequestMeta) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException();
    }

    if (payload.type !== 'refresh' || !payload.jti) {
      throw new UnauthorizedException();
    }

    const session = await this.prisma.refreshSession.findUnique({
      where: { id: payload.jti },
      include: { user: true },
    });
    const validSession =
      session &&
      !session.revokedAt &&
      session.expiresAt > new Date() &&
      session.tokenHash === this.hashToken(refreshToken) &&
      session.user.status === AdminStatus.ACTIVE;

    if (!validSession || !session) {
      throw new UnauthorizedException();
    }

    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(
      {
        userId: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role,
        status: session.user.status,
      },
      meta,
    );
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
        ignoreExpiration: true,
      });
      if (payload.jti) {
        await this.prisma.refreshSession.updateMany({
          where: { id: payload.jti, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    } catch {
      return;
    }
  }

  private async issueTokens(user: AuthUser, meta: RequestMeta) {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + this.refreshDays * 24 * 60 * 60 * 1000);
    const safePayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      status: user.status,
    };
    const accessToken = await this.jwt.signAsync(
      { ...safePayload, type: 'access' } satisfies JwtPayload,
      { secret: this.accessSecret, expiresIn: this.accessTtl as never },
    );
    const refreshToken = await this.jwt.signAsync(
      { ...safePayload, type: 'refresh', jti: sessionId } satisfies JwtPayload,
      { secret: this.refreshSecret, expiresIn: `${this.refreshDays}d` },
    );

    await this.prisma.refreshSession.create({
      data: {
        id: sessionId,
        userId: user.userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    return { accessToken, refreshToken, user };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private requireSecret(config: ConfigService, key: string): string {
    const value = config.get<string>(key);
    if (!value || value.length < 32) {
      throw new Error(`${key} must contain at least 32 characters.`);
    }
    return value;
  }
}
