import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminRole, AdminStatus, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { AuthUser } from '../../common/auth/auth-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminUserDto, UpdateAdminStatusDto, UpdateAdminUserDto } from './dto/admin-user.dto';

const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
} satisfies Prisma.AdminUserSelect;

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.adminUser.findMany({
      where: { status: { not: AdminStatus.DELETED } },
      select: publicUserSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    const user = await this.prisma.adminUser.findFirst({
      where: { id, status: { not: AdminStatus.DELETED } },
      select: publicUserSelect,
    });
    if (!user) {
      throw new NotFoundException('Admin user not found');
    }
    return user;
  }

  async create(dto: CreateAdminUserDto, actor: AuthUser, ipAddress?: string) {
    if (dto.status === AdminStatus.DELETED) {
      throw new BadRequestException('A new user cannot be created as deleted.');
    }

    try {
      const user = await this.prisma.adminUser.create({
        data: {
          email: dto.email.trim().toLowerCase(),
          passwordHash: await hash(dto.password, 12),
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          role: dto.role,
          status: dto.status,
          createdBy: actor.userId,
          updatedBy: actor.userId,
        },
        select: publicUserSelect,
      });
      await this.audit(actor.userId, 'ADMIN_USER_CREATED', user.id, ipAddress, {
        role: user.role,
        status: user.status,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An admin user with this email already exists.');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateAdminUserDto, actor: AuthUser, ipAddress?: string) {
    const current = await this.getRequiredUser(id);
    if (id === actor.userId && dto.role && dto.role !== actor.role) {
      throw new BadRequestException('You cannot change your own role.');
    }
    if (current.role === AdminRole.SUPER_ADMIN && dto.role && dto.role !== AdminRole.SUPER_ADMIN) {
      await this.ensureAnotherActiveSuperAdmin(id);
    }

    const user = await this.prisma.adminUser.update({
      where: { id },
      data: {
        firstName: dto.firstName?.trim(),
        lastName: dto.lastName?.trim(),
        role: dto.role,
        passwordHash: dto.password ? await hash(dto.password, 12) : undefined,
        updatedBy: actor.userId,
      },
      select: publicUserSelect,
    });
    await this.audit(actor.userId, 'ADMIN_USER_UPDATED', id, ipAddress, {
      role: dto.role,
      passwordReset: Boolean(dto.password),
    });
    return user;
  }

  async updateStatus(id: string, dto: UpdateAdminStatusDto, actor: AuthUser, ipAddress?: string) {
    const current = await this.getRequiredUser(id);
    if (id === actor.userId && dto.status !== AdminStatus.ACTIVE) {
      throw new BadRequestException('You cannot deactivate your own account.');
    }
    if (
      current.role === AdminRole.SUPER_ADMIN &&
      current.status === AdminStatus.ACTIVE &&
      dto.status !== AdminStatus.ACTIVE
    ) {
      await this.ensureAnotherActiveSuperAdmin(id);
    }

    const user = await this.prisma.$transaction(async (transaction) => {
      const updated = await transaction.adminUser.update({
        where: { id },
        data: {
          status: dto.status,
          deletedAt: dto.status === AdminStatus.DELETED ? new Date() : null,
          updatedBy: actor.userId,
        },
        select: publicUserSelect,
      });
      if (dto.status !== AdminStatus.ACTIVE) {
        await transaction.refreshSession.updateMany({
          where: { userId: id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
      return updated;
    });
    await this.audit(actor.userId, 'ADMIN_USER_STATUS_CHANGED', id, ipAddress, {
      status: dto.status,
    });
    return user;
  }

  async remove(id: string, actor: AuthUser, ipAddress?: string): Promise<void> {
    if (id === actor.userId) {
      throw new BadRequestException('You cannot delete your own account.');
    }
    const current = await this.getRequiredUser(id);
    if (current.role === AdminRole.SUPER_ADMIN && current.status === AdminStatus.ACTIVE) {
      await this.ensureAnotherActiveSuperAdmin(id);
    }

    await this.prisma.$transaction([
      this.prisma.adminUser.update({
        where: { id },
        data: {
          status: AdminStatus.DELETED,
          deletedAt: new Date(),
          updatedBy: actor.userId,
        },
      }),
      this.prisma.refreshSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    await this.audit(actor.userId, 'ADMIN_USER_DELETED', id, ipAddress);
  }

  private async getRequiredUser(id: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user || user.status === AdminStatus.DELETED) {
      throw new NotFoundException('Admin user not found');
    }
    return user;
  }

  private async ensureAnotherActiveSuperAdmin(excludedId: string): Promise<void> {
    const count = await this.prisma.adminUser.count({
      where: {
        id: { not: excludedId },
        role: AdminRole.SUPER_ADMIN,
        status: AdminStatus.ACTIVE,
      },
    });
    if (count === 0) {
      throw new BadRequestException('At least one active SUPER_ADMIN must remain.');
    }
  }

  private async audit(
    actorId: string,
    action: string,
    entityId: string,
    ipAddress?: string,
    metadata?: Prisma.InputJsonValue,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType: 'AdminUser',
        entityId,
        ipAddress,
        metadata,
      },
    });
  }
}
