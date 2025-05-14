import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO для создания локации
 */
export class CreateLocationDto {
  /**
   * Название локации
   * @example "ТЦ Метрополис"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Короткое название локации (для URL и идентификации)
   * @example "metropolis"
   */
  @IsString()
  @IsNotEmpty()
  short_name: string;

  /**
   * Адрес локации
   * @example "ул. Примерная, д. 123"
   */
  @IsString()
  @IsOptional()
  address?: string;

  /**
   * ID города, к которому относится локация
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsNotEmpty()
  cityId: string;
} 