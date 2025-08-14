import { IsEnum, IsOptional, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum ListSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class FindListsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsString()
  sizeId?: string;

  // @IsOptional()
  // @Type(() => Boolean)
  // @IsBoolean()
  // closed?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ListSortField)
  sortBy?: ListSortField = ListSortField.CREATED_AT;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC;
} 