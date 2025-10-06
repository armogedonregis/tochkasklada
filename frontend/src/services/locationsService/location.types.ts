import { FilterParams, PaginatedResponse, SortDirection } from '../services.types';
import { City } from '../citiesService/city.types';

export enum LocationSortField {
  NAME = 'name',
  SHORT_NAME = 'short_name',
  CREATED_AT = 'createdAt',
  CITY = 'city',
}

export interface Location {
  id: string;
  name: string;
  short_name: string;
  address: string;
  cityId: string;
  createdAt?: string;
  updatedAt?: string;
  city?: City;
}

export interface CreateLocationDto {
  name: string;
  short_name: string;
  address?: string;
  cityId: string;
}

export interface UpdateLocationDto {
  name?: string;
  short_name?: string;
  address?: string;
  cityId?: string;
}

export interface LocationFilters extends FilterParams {
  cityId?: string;
  sortBy?: LocationSortField;
  sortDirection?: SortDirection;
}

export type PaginatedLocationResponse = PaginatedResponse<Location>; 