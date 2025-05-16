export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Направление сортировки
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface FilterParams extends PaginationParams {
  search?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface PaginationMeta {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
} 