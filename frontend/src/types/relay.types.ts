import { Panel } from './panel.types';

export type RelayType = 'SECURITY' | 'LIGHT' | 'GATE';

export interface Relay {
  id: string;
  relayNumber: number;
  name: string;
  type: RelayType;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  panelId: string;
  panel?: Panel;
}

export interface CreateRelayRequest {
  name: string;
  relayNumber: number;
  type: RelayType;
  panelId: string;
}

export interface UpdateRelayRequest {
  id: string;
  name?: string;
  relayNumber?: number;
  type?: RelayType;
} 