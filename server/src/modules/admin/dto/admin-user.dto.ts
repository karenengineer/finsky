import { AdminRole, AdminStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

const PASSWORD_MESSAGE = 'Password must contain at least 8 characters, one letter, and one number.';

export class CreateAdminUserDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName!: string;

  @IsEnum(AdminRole)
  role!: AdminRole;

  @IsEnum(AdminStatus)
  status!: AdminStatus;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,128}$/, { message: PASSWORD_MESSAGE })
  password!: string;
}

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,128}$/, { message: PASSWORD_MESSAGE })
  password?: string;
}

export class UpdateAdminStatusDto {
  @IsEnum(AdminStatus)
  status!: AdminStatus;
}
