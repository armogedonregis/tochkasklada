import { Relay } from './relay.types';

export interface RelayAccess {
  id: string;
  userId: string;
  relayId: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  relay?: Relay;
}

export interface CreateRelayAccessRequest {
  userId: string;
  relayId: string;
  validUntil: string;
}

export interface UpdateRelayAccessRequest {
  id: string;
  validUntil?: string;
  isActive?: boolean;
} 