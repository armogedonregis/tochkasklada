import { IsOptional, IsInt, Min, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentSortField {
  CREATED_AT = 'CREATED_AT',
  AMOUNT = 'AMOUNT',
  STATUS = 'STATUS',
  ORDER_ID = 'ORDER_ID'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class FindPaymentsDto {
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
  @IsEnum(PaymentSortField)
  sortBy?: PaymentSortField;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  onlyPaid?: boolean;
} 