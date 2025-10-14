import { IsOptional, IsInt, Min, IsString, IsEnum, IsBoolean, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CellRentalStatus } from '@prisma/client';

export enum CellRentalSortField {
  CREATED_AT = 'createdAt',
  START_DATE = 'startDate', 
  END_DATE = 'endDate',
  RENTAL_STATUS = 'rentalStatus'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class FindCellRentalsDto {
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
  @IsEnum(CellRentalSortField)
  sortBy?: CellRentalSortField;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;

  @IsOptional()
  @IsEnum(CellRentalStatus)
  rentalStatus?: CellRentalStatus;

  @IsOptional()
  @IsUUID()
  locationId?: string;
} 