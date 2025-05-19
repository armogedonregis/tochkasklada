import { FilterParams, PaginatedResponse, SortDirection } from '../services.types';
import { User } from '../paymentsService/payments.types';

// Перечисление полей сортировки для клиентов
export enum ClientSortField {
  NAME = 'name',
  EMAIL = 'email',
  CREATED_AT = 'createdAt'
}

// Тип для телефона клиента, возвращаемый с сервера
export interface ClientPhone {
  id: string;
  phone: string;
}

// Объединенный тип для телефона
export type Phone = ClientPhone | string;

export interface Client {
  id: string;
  userId: string;
  name: string;
  phones: any[];
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phones?: any[];
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phones?: any[];
}

export interface AddPhoneDto {
  phone: string;
}

export interface ClientFilters extends FilterParams {
  search?: string;
  sortBy?: ClientSortField;
  sortDirection?: SortDirection;
}

export type PaginatedClientResponse = PaginatedResponse<Client>; 