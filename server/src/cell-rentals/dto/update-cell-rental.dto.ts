export class UpdateCellRentalDto {
  cellId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  statusId?: string;
  isActive?: boolean;
  extensionCount?: number;
  lastExtendedAt?: string;
  closedAt?: string;
} 