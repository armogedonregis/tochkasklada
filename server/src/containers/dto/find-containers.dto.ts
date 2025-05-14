import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Enum для полей сортировки контейнеров
 */
export enum ContainerSortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  LOCATION = 'location',
}

/**
 * Направление сортировки
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * DTO для поиска контейнеров с пагинацией
 */
export class FindContainersDto {
  /**
   * Поисковая строка для фильтрации по номеру контейнера, локации или городу
   * @example "2" или "Метрополис" или "Москва"
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
  @IsEnum(ContainerSortField)
  @IsOptional()
  sortBy?: ContainerSortField = ContainerSortField.NAME;

  /**
   * Направление сортировки
   * @default "asc"
   * @example "desc"
   */
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection = SortDirection.ASC;
} 