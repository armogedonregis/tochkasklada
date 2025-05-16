import { FilterParams, PaginatedResponse, SortDirection } from './common.types';

// Перечисление полей сортировки для размеров
export enum SizeSortField {
  NAME = 'name',
  SHORT_NAME = 'short_name',
  SIZE = 'size',
  AREA = 'area',
  CREATED_AT = 'createdAt'
}

export interface Size {
  id: string;
  name: string;
  short_name: string;
  size: string;
  area: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSizeDto {
  name: string;
  short_name: string;
  size: string;
  area: string;
}

export interface UpdateSizeDto {
  name?: string;
  short_name?: string;
  size?: string;
  area?: string;
}

export interface SizeFilters extends FilterParams {
  sortBy?: SizeSortField;
  sortDirection?: SortDirection;
}

export type PaginatedSizeResponse = PaginatedResponse<Size>; 