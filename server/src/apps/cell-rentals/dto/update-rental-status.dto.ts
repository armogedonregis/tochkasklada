import { CellRentalStatus } from '@prisma/client';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateRentalStatusDto {
  @IsNotEmpty()
  @IsEnum(CellRentalStatus)
  rentalStatus: CellRentalStatus;
}
