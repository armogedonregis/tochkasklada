export interface CellStatus {
  id: string;
  name: string;
  color: string;
  statusType?: CellRentalStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCellStatusDto {
  name: string;
  color: string;
  statusType?: CellRentalStatus;
}

export interface UpdateCellStatusDto {
  name?: string;
  color?: string;
  statusType?: CellRentalStatus;
}

// Статусы аренды ячеек
export enum CellRentalStatus {
  ACTIVE = 'ACTIVE',           // Активная аренда
  EXPIRING_SOON = 'EXPIRING_SOON',    // Скоро истекает (осталось меньше недели)
  EXPIRED = 'EXPIRED',          // Просрочена (дата окончания в прошлом)
  CLOSED = 'CLOSED',           // Договор закрыт администратором
  RESERVATION = 'RESERVATION',      // Бронь
  EXTENDED = 'EXTENDED',         // Продлен
  PAYMENT_SOON = 'PAYMENT_SOON',     // Скоро оплата
}
