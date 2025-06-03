import { DateRangeParams, FilterParams, PaginatedResponse, SortDirection } from '../services.types';

// Перечисление полей сортировки для платежей
export enum StatisticsSortField {
  CREATED_AT = 'CREATED_AT',
  AMOUNT = 'AMOUNT',
  STATUS = 'STATUS',
  ORDER_ID = 'ORDER_ID'
}

export interface StatisticsFilters extends FilterParams, DateRangeParams {
  locationId?: string;
  // sortBy?: StatisticsSortField;
  sortDirection?: SortDirection;
}

export type PaginatedStatisticsResponse = PaginatedResponse<StatisticsPayments>;

export type StatisticsPayments = {
  locationId: string;
  locationName: string;
  locationShortName: string;
  cityName: string;
  cityShortName: string;
  totalPayments: number;
  totalAmount: number;
  activeRentals: number;
  averagePayment: number;
  lastPaymentDate: Date;
  revenuePerRental: number;
}