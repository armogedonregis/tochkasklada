import { CellRentalStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsHexColor, IsOptional, IsEnum } from 'class-validator';

export class CreateCellStatusDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsHexColor()
  color: string;

  @IsOptional()
  @IsEnum(CellRentalStatus)
  statusType: CellRentalStatus;
} 