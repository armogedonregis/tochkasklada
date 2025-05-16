import { FilterParams, PaginatedResponse, SortDirection } from './common.types';
import { Location } from './location.types';

/**
 * Enum для полей сортировки контейнеров
 */
export enum ContainerSortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  LOCATION = 'location',
}

export interface Container {
  id: string;
  name: number;
  locId?: string;
  createdAt?: string;
  updatedAt?: string;
  location?: Location;
  cells?: Cell[]; // Массив ячеек
}

/**
 * Расширенный интерфейс контейнера для отображения с развернутым состоянием
 */
export interface ContainerWithExpanded extends Container {
  expanded: boolean;
}

/**
 * Интерфейс для ячейки контейнера
 */
export interface Cell {
  id: string;
  name: number;
  size?: {
    size?: string;
    area?: number;
  };
}

export interface CreateContainerDto {
  name: string;
  locId?: string;
  cells?: { name: string; size_id: string }[];
}

export interface UpdateContainerDto {
  name?: string;
  locId?: string;
}

export interface ContainerFilters extends FilterParams {
  locId?: string;
  sortBy?: ContainerSortField;
  sortDirection?: SortDirection;
}

export type PaginatedContainerResponse = PaginatedResponse<Container>; 