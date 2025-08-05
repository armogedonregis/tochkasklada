import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для телефона с комментарием
 */
export class PhoneDto {
  /**
   * Номер телефона
   * @example "79001234567"
   */
  @IsString()
  @IsNotEmpty()
  phone: string;

  /**
   * Комментарий к телефону
   * @example "Рабочий номер"
   */
  @IsString()
  @IsOptional()
  comment?: string;
}

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
   * @example [{"phone": "79001234567", "comment": "Рабочий номер"}]
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneDto)
  @IsOptional()
  phones?: PhoneDto[];

  /**
   * Активность клиента
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
} 