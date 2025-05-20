import { FilterParams, DateRangeParams, PaginatedResponse } from '../services.types';
import { Cell } from '../cellService/cell.types';
import { Client } from '../clientsService/clients.types';
import { Container } from '../containersService/container.types';

export interface CellRental {
  id: string;
  cellId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  cell?: Cell & {
    container?: Container;
  };
  client?: Client;
  rentalStatus: CellRentalStatus;
  container?: Container;
}

export enum CellRentalStatus {
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
  RESERVATION = 'RESERVATION',
  EXTENDED = 'EXTENDED',
  PAYMENT_SOON = 'PAYMENT_SOON'
}

export interface CreateCellRentalDto {
  cellId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface UpdateCellRentalDto {
  cellId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface CellRentalFilters extends FilterParams, DateRangeParams {
  cellId?: string;
  clientId?: string;
  isActive?: boolean;
  locationId?: string;
} 

export type PaginatedCellRentalResponse = PaginatedResponse<CellRental>; 