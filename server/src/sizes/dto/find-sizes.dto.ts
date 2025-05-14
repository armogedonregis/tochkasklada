import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Enum для полей сортировки размеров ячеек
 */
export enum SizeSortField {
  NAME = 'name',
  SHORT_NAME = 'short_name',
  SIZE = 'size', 
  AREA = 'area',
  CREATED_AT = 'createdAt',
}

/**
 * Направление сортировки
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * DTO для поиска размеров ячеек с пагинацией
 */
export class FindSizesDto {
  /**
   * Поисковая строка для фильтрации
   * @example "большой" или "L"
   */
  @IsString()
  @IsOptional()
  search?: string;

  /**
   * Номер страницы (начиная с 1)
   * @minimum 1
   * @default 1
   * @example 1
   */
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  /**
   * Количество элементов на странице
   * @minimum 1
   * @default 10
   * @example 10
   */
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  /**
   * Поле для сортировки
   * @default "name"
   * @example "createdAt"
   */
  @IsEnum(SizeSortField)
  @IsOptional()
  sortBy?: SizeSortField = SizeSortField.NAME;

  /**
   * Направление сортировки
   * @default "asc"
   * @example "desc"
   */
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection = SortDirection.ASC;
} 