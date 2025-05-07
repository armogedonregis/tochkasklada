export class UpdatePaymentDto {
  amount?: number;
  description?: string;
  status?: boolean;
  
  // Поля для работы с арендой ячейки
  cellRentalId?: string;    // ID существующей аренды для привязки
  cellId?: string;          // ID ячейки (для создания новой аренды)
  rentalMonths?: number;    // Количество месяцев аренды
  extendRental?: boolean;   // Продлить связанную аренду
  detachRental?: boolean;   // Отвязать от аренды
  
  // Поля для корректировки дат аренды
  rentalStartDate?: string; // Новая дата начала аренды
  rentalEndDate?: string;   // Новая дата окончания аренды
} 