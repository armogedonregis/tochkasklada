export enum RelayType {
  SECURITY = 'SECURITY', // Дверь
  LIGHT = 'LIGHT',       // Свет
  GATE = 'GATE'          // Ворота
}

export interface Relay {
  id: string;
  name: string;
  relayNumber: number;
  type: RelayType;
  panelId: string;
  cellId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelayDto {
  name: string;
  relayNumber: number;
  type: RelayType;
  panelId: string;
  cellId?: string;
}

export interface UpdateRelayDto {
  name?: string;
  relayNumber?: number;
  type?: RelayType;
  cellId?: string;
}

export interface ToggleRelayDto {
  state: boolean;
} 