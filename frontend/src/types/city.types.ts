import { FilterParams, PaginatedResponse, SortDirection } from './common.types';

/**
 * Enum для полей сортировки городов
 */
export enum CitySortField {
  TITLE = 'title',
  SHORT_NAME = 'short_name',
  CREATED_AT = 'createdAt',
}


export interface City {
  id: string;
  title: string;
  short_name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCityDto {
  title: string;
  short_name: string;
}

export interface UpdateCityDto {
  title?: string;
  short_name?: string;
}

export interface CityFilters extends FilterParams {
  sortBy?: CitySortField;
  sortDirection?: SortDirection;
}

export type PaginatedCityResponse = PaginatedResponse<City>; 