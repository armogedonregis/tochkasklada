import { IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateLocationDto } from './create-location.dto';

/**
 * DTO для обновления локации
 */
export class UpdateLocationDto implements Partial<CreateLocationDto> {
  /**
   * Название локации
   * @example "ТЦ Метрополис"
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Короткое название локации (для URL и идентификации)
   * @example "metropolis"
   */
  @IsString()
  @IsOptional()
  short_name?: string;

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
  @IsOptional()
  cityId?: string;
} 