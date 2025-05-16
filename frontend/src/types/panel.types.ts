import { FilterParams } from './common.types';

export interface Panel {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  login: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePanelDto {
  name: string;
  ipAddress: string;
  port: number;
  login: string;
  password: string;
}

export interface UpdatePanelDto {
  name?: string;
  ipAddress?: string;
  port?: number;
  login?: string;
  password?: string;
}

export interface PanelFilters extends FilterParams {} 