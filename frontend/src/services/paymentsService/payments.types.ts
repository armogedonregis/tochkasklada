import { CellRental } from '../cellRentalsService/cellRentals.types';
import { Client } from '../clientsService/clients.types';
import { FilterParams, DateRangeParams, PaginatedResponse, SortDirection } from '../services.types';

// Перечисление полей сортировки для платежей
export enum PaymentSortField {
  CREATED_AT = 'CREATED_AT',
  AMOUNT = 'AMOUNT',
  STATUS = 'STATUS',
  ORDER_ID = 'ORDER_ID'
}

export interface User {
  id: string;
  email: string;
  client: Client;
}

export interface Payment {
  id: string;
  amount: number;
  orderId?: string;
  description?: string;
  userId: string;
  status: boolean;
  bankPaymentId?: string;
  paymentUrl?: string;
  rentalDuration?: number;
  cellRentalId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  cellRental?: CellRental;
}

export interface CreatePaymentDto {
  userId: string;
  amount: number;
  description: string;
  status?: boolean;
  cellId?: string;
  statusId?: string;
}

export interface CreateAdminPaymentDto {
  userId: string;
  amount: number; // Сумма в рублях
  description?: string;
  status?: boolean;
  cellId?: string;
  statusId?: string;
  rentalDuration?: number;
}

export interface UpdatePaymentDto {
  userId?: string;
  amount?: number;
  description?: string;
  status?: boolean;
  cellId?: string;
  statusId?: string;
  rentalDuration?: number;
}

export interface SetPaymentStatusDto {
  id: string;
  status: boolean;
}

export interface PaymentFilters extends FilterParams {
  userId?: string;
  onlyPaid?: boolean;
  sortBy?: PaymentSortField;
  sortDirection?: SortDirection;
}

export type PaginatedPaymentResponse = PaginatedResponse<Payment>;