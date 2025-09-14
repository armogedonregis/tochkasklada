import { IsOptional, IsString } from 'class-validator';

/**
 * DTO для обновления города
 */
export class UpdateCityDto {
  /**
   * Полное название города
   * @example "Москва"
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * Короткое название города (для URL и идентификации)
   * @example "msk"
   */
  @IsString()
  @IsOptional()
  short_name?: string;
} 