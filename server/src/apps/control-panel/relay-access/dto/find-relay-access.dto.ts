import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum RelayAccessSortField {
  CREATED_AT = 'CREATED_AT',
  VALID_UNTIL = 'VALID_UNTIL'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class FindRelayAccessDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsEnum(RelayAccessSortField)
  sortBy?: RelayAccessSortField;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
} 