import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum RequestStatus {
  WAITING = 'WAITING',
  CLOSED = 'CLOSED'
}

export enum RequestSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email',
  STATUS = 'status'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class FindRequestsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(RequestSortField)
  sortBy?: RequestSortField = RequestSortField.CREATED_AT;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC;
} 