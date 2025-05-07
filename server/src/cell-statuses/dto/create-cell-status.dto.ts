import { CellRentalStatus } from '@prisma/client';

export class CreateCellStatusDto {
  name: string;
  color: string;
  isActive?: boolean;
  statusType?: CellRentalStatus; // Использование типа enum вместо string
} 