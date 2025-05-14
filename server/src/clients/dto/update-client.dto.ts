import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';

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
   * @example ["79001234567", "79007654321"]
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  phones?: string[];
} 