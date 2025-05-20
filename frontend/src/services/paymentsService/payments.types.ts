import { FilterParams, DateRangeParams, PaginatedResponse, SortDirection } from '../services.types';

// Перечисление полей сортировки для платежей
export enum PaymentSortField {
  ORDER_ID = 'orderId',
  AMOUNT = 'amount',
  DESCRIPTION = 'description',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  USER_ID = 'userId'
}

export interface User {
  id: string;
  email: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  description: string;
  orderId?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  cellId?: string;
}

export interface CreatePaymentDto {
  userId: string;
  amount: number;
  description: string;
  status?: boolean;
  cellId?: string;
  rentalMonths?: number;
  statusId?: string;
}

export interface CreateAdminPaymentDto {
  userId: string;
  amount: number; // Сумма в рублях
  description?: string;
  status?: boolean;
  cellId?: string;
  rentalMonths?: number;
  statusId?: string;
}

export interface UpdatePaymentDto {
  userId?: string;
  amount?: number;
  description?: string;
  status?: boolean;
  cellId?: string;
  rentalMonths?: number;
  statusId?: string;
}

export interface SetPaymentStatusDto {
  id: string;
  status: boolean;
}

export interface PaymentFilters extends FilterParams {
  userId?: string;
  status?: boolean;
  sortBy?: PaymentSortField;
  sortDirection?: SortDirection;
}

export type PaginatedPaymentResponse = PaginatedResponse<Payment>; 