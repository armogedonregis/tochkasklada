import { FilterParams, DateRangeParams, PaginatedResponse } from '../services.types';
import { Cell } from '../cellService/cell.types';
import { Client } from '../clientsService/clients.types';
import { Container } from '../containersService/container.types';
import { Size } from '../sizesService/sizes.types';

export enum CellRentalSortField {
  CREATED_AT = 'CREATED_AT',
  START_DATE = 'START_DATE', 
  END_DATE = 'END_DATE',
  RENTAL_STATUS = 'RENTAL_STATUS'
}

export enum CellFreeSortField {
  NAME = 'name',
  SIZE = 'size',
  LOCATION = 'location',
  CITY = 'city',
}

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

export interface CellFreeRental extends Cell {
  container: Container;
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

export type CellRentalStatusType = "ALL" | "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "CLOSED" | "RESERVATION" | "EXTENDED" | "PAYMENT_SOON"

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
  rentalStatus?: CellRentalStatusType;
} 

export type PaginatedCellRentalResponse = PaginatedResponse<CellRental>;
export type PaginatedFreeCellRentalResponse = PaginatedResponse<CellFreeRental>;