import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO для создания пользователя
 */
export class CreateUserDto {
  /**
   * Email пользователя
   * @example "user@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Пароль пользователя
   * @minLength 6
   * @example "password123"
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
} 