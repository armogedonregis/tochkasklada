import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для создания города
 */
export class CreateCityDto {
  /**
   * Полное название города
   * @example "Москва"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Короткое название города (для URL и идентификации)
   * @example "msk"
   */
  @IsString()
  @IsNotEmpty()
  short_name: string;
} 