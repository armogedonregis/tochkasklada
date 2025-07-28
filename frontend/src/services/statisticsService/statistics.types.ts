import { DateRangeParams, FilterParams, PaginatedResponse, SortDirection } from '../services.types';

// Перечисление полей сортировки для платежей
export enum StatisticsSortField {
  CREATED_AT = 'CREATED_AT',
  AMOUNT = 'AMOUNT',
  STATUS = 'STATUS',
  ORDER_ID = 'ORDER_ID'
}

// Перечисление полей сортировки для платежей в локации
export enum LocationPaymentSortField {
  CREATED_AT = 'createdAt',
  AMOUNT = 'amount',
  DESCRIPTION = 'description',
  ORDER_ID = 'orderId'
}

export interface StatisticsFilters extends FilterParams, DateRangeParams {
  locationId?: string;
  sortDirection?: SortDirection;
}

export interface LocationPaymentFilters extends FilterParams, DateRangeParams {
  sortBy?: LocationPaymentSortField;
  sortDirection?: SortDirection;
}

export type PaginatedStatisticsResponse = PaginatedResponse<StatisticsPayments>;
export type PaginatedLocationPaymentsResponse = PaginatedResponse<LocationPaymentDetail>;

export type StatisticsPayments = {
  locationId: string;
  locationName: string;
  locationShortName: string;
  cityName: string;
  cityShortName: string;
  totalPayments: number;
  totalAmount: number;
  activeRentals: number;
  totalRentals: number; // Общее количество аренд (активных + завершенных)
  averagePayment: number;
  lastPaymentDate: Date;
  revenuePerRental: number;
}

// Детальная информация о платеже в локации
export type LocationPaymentDetail = {
  id: string;
  amount: number;
  description: string | null;
  createdAt: Date;
  orderId: string | null;
  bankPaymentId: string | null;
  user: {
    id: string;
    email: string;
    client: {
      id: string;
      name: string;
      phones: Array<{
        phone: string;
      }>;
    } | null;
  };
  cellRental: {
    id: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    rentalStatus: string;
    cell: {
      id: string;
      name: string;
      container: {
        id: string;
        name: string;
      };
    };
  } | null;
}