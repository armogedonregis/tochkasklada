export interface CellStatus {
  id: string;
  name: string;
  color: string;
  statusType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCellStatusDto {
  name: string;
  color: string;
  statusType?: string;
}

export interface UpdateCellStatusDto {
  name?: string;
  color?: string;
  statusType?: string;
} 