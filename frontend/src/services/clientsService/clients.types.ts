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
  comment?: string;
}

// Тип для создания/обновления телефона
export interface PhoneData {
  phone: string;
  comment?: string;
}

// Объединенный тип для телефона
export type Phone = ClientPhone | string;

export interface Client {
  id: string;
  userId: string;
  name: string;
  phones: ClientPhone[];
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phones?: PhoneData[];
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phones?: PhoneData[];
}

export interface AddPhoneDto {
  phone: string;
  comment?: string;
}

export interface ClientFilters extends FilterParams {
  search?: string;
  sortBy?: ClientSortField;
  sortDirection?: SortDirection;
}

export type PaginatedClientResponse = PaginatedResponse<Client>; 