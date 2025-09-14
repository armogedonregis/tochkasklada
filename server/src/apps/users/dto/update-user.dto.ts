import { IsEmail, IsOptional, IsString, MinLength, IsArray, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO для обновления пользователя
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * Email пользователя
   * @example "user@example.com"
   */
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * Пароль пользователя
   * @minLength 6
   * @example "newpassword123"
   */
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds?: string[];
} 