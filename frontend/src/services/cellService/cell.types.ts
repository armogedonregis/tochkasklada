import { FilterParams, PaginatedResponse, SortDirection } from '../services.types';
import { Size } from '../sizesService/sizes.types';

// Перечисление полей сортировки для ячеек
export enum CellSortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  SIZE = 'size',
  LOCATION = 'location',
  CITY = 'city'
}

export interface Cell {
  id: string;
  name: string;
  containerId: string;
  size_id: string;
  comment?: string;
  statusId?: string;
  size?: Size;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCellDto {
  name: string;
  containerId: string;
  size_id: string;
  comment?: string;
  statusId?: string;
}

export interface UpdateCellDto {
  name?: string;
  containerId?: string;
  size_id?: string;
  comment?: string;
  statusId?: string;
}

export interface CellFilters extends FilterParams {
  containerId?: string;
  locationId?: string;
  sizeId?: string;
  available?: boolean;
  sortBy?: CellSortField;
  sortDirection?: SortDirection;
}

export type PaginatedCellResponse = PaginatedResponse<Cell>; 