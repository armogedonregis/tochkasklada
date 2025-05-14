import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO для создания размера ячейки
 */
export class CreateSizeDto {
  /**
   * Название размера ячейки
   * @example "Большая"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Короткое название размера ячейки
   * @example "L"
   */
  @IsString()
  @IsNotEmpty()
  short_name: string;

  /**
   * Размер ячейки
   * @example "2x3 м"
   */
  @IsString()
  @IsNotEmpty()
  size: string;

  /**
   * Площадь ячейки
   * @example "6 м²"
   */
  @IsString()
  @IsNotEmpty()
  area: string;
} 