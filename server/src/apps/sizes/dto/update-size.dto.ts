import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeDto } from './create-size.dto';

/**
 * DTO для обновления размера ячейки
 */
export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  /**
   * Название размера ячейки
   * @example "Большая"
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Короткое название размера ячейки
   * @example "L"
   */
  @IsString()
  @IsOptional()
  short_name?: string;

  /**
   * Размер ячейки
   * @example "2x3 м"
   */
  @IsString()
  @IsOptional()
  size?: string;

  /**
   * Площадь ячейки
   * @example "6 м²"
   */
  @IsString()
  @IsOptional()
  area?: string;
} 