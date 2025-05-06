import { Relay } from './relay.types';

export interface Panel {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  login: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  relays?: Relay[];
}

export interface CreatePanelRequest {
  name: string;
  ipAddress: string;
  port: number;
  login: string;
  password: string;
}

export interface UpdatePanelRequest {
  id: string;
  name?: string;
  ipAddress?: string;
  port?: number;
  login?: string;
  password?: string;
  isActive?: boolean;
} 