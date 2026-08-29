import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { Request } from 'express';
import { AuthUser } from '../../common/auth/auth-user.interface';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { Roles } from '../../common/auth/roles.decorator';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto, UpdateAdminStatusDto, UpdateAdminUserDto } from './dto/admin-user.dto';

@Controller('admin/users')
@Roles(AdminRole.SUPER_ADMIN)
export class AdminUsersController {
  constructor(private readonly users: AdminUsersService) {}

  @Get()
  list() {
    return this.users.list();
  }

  @Post()
  create(@Body() dto: CreateAdminUserDto, @CurrentUser() actor: AuthUser, @Req() request: Request) {
    return this.users.create(dto, actor, request.ip);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.users.get(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @CurrentUser() actor: AuthUser,
    @Req() request: Request,
  ) {
    return this.users.update(id, dto, actor, request.ip);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdminStatusDto,
    @CurrentUser() actor: AuthUser,
    @Req() request: Request,
  ) {
    return this.users.updateStatus(id, dto, actor, request.ip);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthUser, @Req() request: Request) {
    return this.users.remove(id, actor, request.ip);
  }
}
