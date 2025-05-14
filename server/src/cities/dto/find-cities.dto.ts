import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Enum для полей сортировки городов
 */
export enum CitySortField {
  TITLE = 'title',
  SHORT_NAME = 'short_name',
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
 * DTO для поиска городов с пагинацией
 */
export class FindCitiesDto {
  /**
   * Поисковый запрос (для названия города)
   * @example "Москва"
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
   * @default "createdAt"
   * @example "title"
   */
  @IsEnum(CitySortField)
  @IsOptional()
  sortBy?: CitySortField = CitySortField.CREATED_AT;

  /**
   * Направление сортировки
   * @default "desc"
   * @example "asc"
   */
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection = SortDirection.DESC;
} 