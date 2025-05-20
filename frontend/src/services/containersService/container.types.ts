import { FilterParams, PaginatedResponse, SortDirection } from '../services.types';
import { Location } from '../locationsService/location.types';

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
    short_name?: string;
    area?: string;
    size?: string;
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
  cells?: { name: string; size_id: string }[];
}


export interface ContainerFilters extends FilterParams {
  locId?: string;
  sortBy?: ContainerSortField;
  sortDirection?: SortDirection;
}

export type PaginatedContainerResponse = PaginatedResponse<Container>;

// Новый тип для ячейки в DTO создания контейнера
export interface CreateCellWithContainer {
  name: string;  // Буква ячейки (A-H)
  size_id: string;  // ID размера ячейки
}

// DTO для создания нового контейнера с ячейками
export interface CreateContainerWithCellsDto extends CreateContainerDto {
  cells?: CreateCellWithContainer[];  // Массив ячеек для создания
} 