import { IsOptional, IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum ClientSortField {
  NAME = 'name',
  EMAIL = 'email',
  CREATED_AT = 'createdAt'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class FindClientsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(ClientSortField)
  sortBy?: ClientSortField;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 