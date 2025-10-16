import { IsOptional, IsInt, Min, IsEnum, IsUUID, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Enum для полей сортировки ячеек
 */
export enum CellSortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  SIZE = 'size',
  LOCATION = 'location',
  CITY = 'city',
}

/**
 * Направление сортировки
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * DTO для поиска ячеек с пагинацией
 */
export class FindCellsDto {
  /**
   * Поисковая строка для фильтрации
   * @example "A" или "Большая" или "Метрополис"
   */
  @IsString()
  @IsOptional()
  search?: string;

  /**
   * ID локации для фильтрации
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  locationId?: string;

  /**
   * ID размера ячейки для фильтрации
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  sizeId?: string;

  /**
   * Фильтр по доступности (только свободные ячейки)
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  available?: boolean;

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
  @IsEnum(CellSortField)
  @IsOptional()
  sortBy?: CellSortField = CellSortField.NAME;

  /**
   * Направление сортировки
   * @default "asc"
   * @example "desc"
   */
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection = SortDirection.ASC;
} 