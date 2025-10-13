import { CellRentalStatus } from '@prisma/client';
import { IsOptional, IsUUID, IsDateString, IsBoolean, IsInt, Min, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCellRentalDto {
  // Для обратной совместимости
  @IsOptional()
  @IsUUID()
  cellId?: string;

  // Массив ID ячеек для множественной аренды
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  cellIds?: string[];

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