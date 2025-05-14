import { CellRentalStatus } from '@prisma/client';
import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsBoolean, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCellRentalDto {
  @IsNotEmpty()
  @IsUUID()
  cellId: string;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

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
  @IsEnum(CellRentalStatus)
  rentalStatus?: CellRentalStatus;
} 