export class CreateCellRentalDto {
  cellId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  statusId?: string;
  isActive?: boolean;
  extensionCount?: number;
  lastExtendedAt?: string;
} 