import { CellRentalStatus } from '@prisma/client';
import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsBoolean, IsInt, Min, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCellRentalDto {
  // Для обратной совместимости - если передан cellId, он будет добавлен к cellIds
  @IsOptional()
  @IsUUID()
  cellId?: string;

  // Массив ID ячеек для множественной аренды
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  cellIds?: string[];

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