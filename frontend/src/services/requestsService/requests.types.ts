import { FilterParams, PaginatedResponse, SortDirection } from '../services.types';

export enum RequestSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email',
  STATUS = 'status',
}

export enum RequestStatus {
  WAITING = 'WAITING',
  CLOSED = 'CLOSED',
}

export interface RequestItem {
  id: string;
  email: string;
  phone?: string;
  name: string;
  description?: string;
  comment?: string;
  status: RequestStatus;
  closedBy?: {
    user?: {
      id: string;
      email: string;
    };
  } | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CloseRequestDto {
  comment?: string;
  locationId?: string; // Для переноса в конкретную локацию
}

export interface CreateRequestDto {
  email: string;
  phone?: string;
  name: string;
  description?: string;
}

export interface RequestFilters extends FilterParams {
  status?: RequestStatus;
  sortBy?: RequestSortField;
  sortDirection?: SortDirection;
}

export type PaginatedRequestResponse = PaginatedResponse<RequestItem>;


