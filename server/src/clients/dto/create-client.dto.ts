import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO для создания клиента администратором
 */
export class CreateClientDto {
  /**
   * Имя клиента
   * @example "Иван Иванов"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Email клиента
   * @example "client@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Пароль клиента (опционально, если создается без пользователя)
   * @example "password123"
   */
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  /**
   * Телефоны клиента
   * @example ["79001234567", "79007654321"]
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  phones?: string[];
} 