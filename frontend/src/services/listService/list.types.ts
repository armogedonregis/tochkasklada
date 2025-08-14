import { FilterParams, PaginatedResponse, SortDirection } from '../services.types';

// Поля сортировки для листа ожидания
export enum ListSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email'
}

export interface List {
  id: string;
  email: string;
  phone?: string;
  name: string;
  description?: string;
  comment?: string;
  closedById?: string;
  closedBy?: {
    id: string;
    email: string;
  };
  closedAt?: string;
  locationId?: string;
  location?: {
    id: string;
    name: string;
    short_name: string;
  };
  sizeId?: string;
  size?: {
    id: string;
    name: string;
    short_name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateListDto {
  email?: string;
  phone?: string;
  name: string;
  description?: string;
  locationId?: string;
  sizeId?: string;
}

export interface CloseListDto {
  comment: string;
}

export interface ListFilters extends FilterParams {
  locationId?: string;
  sizeId?: string;
  sortBy?: ListSortField;
  sortDirection?: SortDirection;
}

export type PaginatedListResponse = PaginatedResponse<List>;

export interface ListStats {
  waiting: number;
  closed: number;
  total: number;
} 