import { IsArray, IsEmail, IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto, PhoneDto } from './create-client.dto';

/**
 * DTO для обновления клиента
 */
export class UpdateClientDto extends PartialType(CreateClientDto) {
  /**
   * Имя клиента
   * @example "Иван Петров"
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Email клиента
   * @example "new-email@example.com"
   */
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * Телефоны клиента
   * @example [{"phone": "79001234567", "comment": "Рабочий номер"}]
   */
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  phones?: PhoneDto[];

  /**
   * Активность клиента
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 