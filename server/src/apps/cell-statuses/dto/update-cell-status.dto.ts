import { CellRentalStatus } from '@prisma/client';
import { IsString, IsOptional, IsHexColor, IsEnum } from 'class-validator';

export class UpdateCellStatusDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsEnum(CellRentalStatus)
  statusType?: CellRentalStatus;
} 