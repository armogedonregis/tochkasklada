// Интерфейс для размера ячейки
export interface Size {
  id: string;
  name: string;
  short_name: string;
  size: string;
  area: string;
  createdAt?: string;
  updatedAt?: string;
}

// DTO для создания размера
export interface CreateSizeDto {
  name: string;
  short_name: string;
  size: string;
  area: string;
}

// DTO для обновления размера
export interface UpdateSizeDto {
  name?: string;
  short_name?: string;
  size?: string;
  area?: string;
} 