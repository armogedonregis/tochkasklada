import { CellRentalStatus } from '@prisma/client';
import { IsOptional, IsUUID, IsDateString, IsBoolean, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCellRentalDto {
  @IsOptional()
  @IsUUID()
  cellId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  extensionCount?: number;

  @IsOptional()
  @IsDateString()
  lastExtendedAt?: string;

  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @IsOptional()
  @IsEnum(CellRentalStatus)
  rentalStatus?: CellRentalStatus;
} 