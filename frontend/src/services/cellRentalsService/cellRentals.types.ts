import { FilterParams, DateRangeParams } from '../services.types';
import { Cell } from '../cellService/cell.types';
import { Client } from '../clientsService/client.types';

export interface CellRental {
  id: string;
  cellId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  cell?: Cell;
  client?: Client;
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