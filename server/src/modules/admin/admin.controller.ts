import { Controller, Get } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthUser } from '../../common/auth/auth-user.interface';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin')
@Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.VIEWER)
export class AdminController {
  @Get('dashboard')
  dashboard(@CurrentUser() user: AuthUser) {
    return {
      user,
      permissions: {
        canManageContent:
          user.role === AdminRole.SUPER_ADMIN || user.role === AdminRole.ADMIN,
        canManageUsers: user.role === AdminRole.SUPER_ADMIN,
        readOnly: user.role === AdminRole.VIEWER,
      },
    };
  }
}
