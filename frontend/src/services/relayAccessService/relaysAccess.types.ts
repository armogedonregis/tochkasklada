export interface RelayAccess {
  id: string;
  relayId: string;
  cellRentalId?: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelayAccessDto {
  relayId: string;
  cellRentalId?: string;
  validUntil: Date | string;
  isActive?: boolean;
}

export interface CheckRelayAccessDto {
  cellRentalId: string;
  relayId: string;
} 