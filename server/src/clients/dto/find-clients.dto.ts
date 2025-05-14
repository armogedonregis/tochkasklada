import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Enum для полей сортировки
 */
export enum ClientSortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  EMAIL = 'email',
}

/**
 * Направление сортировки
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * DTO для поиска клиентов с пагинацией
 */
export class FindClientsDto {
  /**
   * Поисковый запрос (для name, email, phone)
   * @example "Иван"
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
   * @example "name"
   */
  @IsEnum(ClientSortField)
  @IsOptional()
  sortBy?: ClientSortField = ClientSortField.CREATED_AT;

  /**
   * Направление сортировки
   * @default "desc"
   * @example "asc"
   */
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection = SortDirection.DESC;
} 