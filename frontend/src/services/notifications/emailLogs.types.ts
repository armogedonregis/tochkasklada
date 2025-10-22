import { FilterParams, PaginatedResponse } from '../services.types';
import { CellRental } from '../cellRentalsService/cellRentals.types';
import { Client } from '../clientsService/clients.types';

export enum EmailType {
  RENTAL_EXPIRATION = 'RENTAL_EXPIRATION',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER',
  RENTAL_EXTENDED = 'RENTAL_EXTENDED',
  OTHER = 'OTHER'
}

export enum EmailStatus {
  SENT = 'SENT',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

export enum EmailLogSortField {
  SENT_AT = 'sentAt',
  TYPE = 'type',
  STATUS = 'status'
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  type: EmailType;
  status: EmailStatus;
  error?: string;
  rentalId?: string;
  clientId?: string;
  sentAt: string;
  rental?: CellRental;
  client?: Client;
}

export interface EmailStats {
  total: number;
  byType: Record<EmailType, number>;
  byStatus: Record<EmailStatus, number>;
}

export interface EmailLogFilters extends FilterParams {
  type?: EmailType;
  status?: EmailStatus;
  rentalId?: string;
  clientId?: string;
}

export type PaginatedEmailLogResponse = PaginatedResponse<EmailLog>;