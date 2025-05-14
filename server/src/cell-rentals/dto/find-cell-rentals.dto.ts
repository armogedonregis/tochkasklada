import { IsOptional, IsInt, Min, IsString, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CellRentalStatus } from '@prisma/client';

export enum CellRentalSortField {
  CREATED_AT = 'CREATED_AT',
  START_DATE = 'START_DATE', 
  END_DATE = 'END_DATE',
  RENTAL_STATUS = 'RENTAL_STATUS'
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
  @IsBoolean()
  @Type(() => Boolean)
  onlyActive?: boolean;

  @IsOptional()
  @IsEnum(CellRentalStatus)
  rentalStatus?: CellRentalStatus;

  @IsOptional()
  @IsUUID()
  cellId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  statusId?: string;
} 