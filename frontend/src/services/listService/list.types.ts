import { FilterParams, PaginatedResponse, SortDirection } from '../services.types';

// Перечисление полей сортировки для заявок
export enum ListSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email'
}

// Статусы заявок
export enum ListStatus {
  WAITING = 'WAITING',
  CLOSED = 'CLOSED'
}

export interface List {
  id: string;
  email: string;
  phone?: string;
  name: string;
  description?: string;
  source: string;
  status: ListStatus;
  comment?: string;
  closedById?: string;
  closedBy?: {
    id: string;
    email: string;
  };
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListDto {
  email: string;
  phone?: string;
  name: string;
  source: string;
  description?: string;
}

export interface CloseListDto {
  comment: string;
}

export interface ListFilters extends FilterParams {
  status?: ListStatus;
  sortBy?: ListSortField;
  sortDirection?: SortDirection;
}

export type PaginatedListResponse = PaginatedResponse<List>;

export interface ListStats {
  waiting: number;
  closed: number;
  total: number;
} 