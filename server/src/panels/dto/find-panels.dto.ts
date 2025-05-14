import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Enum для полей сортировки панелей
 */
export enum PanelSortField {
  NAME = 'name',
  IP_ADDRESS = 'ipAddress',
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
 * DTO для поиска панелей с пагинацией
 */
export class FindPanelsDto {
  /**
   * Поисковая строка для фильтрации
   * @example "контроль" или "192.168"
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
  @IsEnum(PanelSortField)
  @IsOptional()
  sortBy?: PanelSortField = PanelSortField.NAME;

  /**
   * Направление сортировки
   * @default "asc"
   * @example "desc"
   */
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection = SortDirection.ASC;
} 