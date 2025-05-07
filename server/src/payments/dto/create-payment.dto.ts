export class CreatePaymentDto {
  amount: number;
  description?: string;
  userId: string;
  cellId?: string; // ID ячейки для аренды
  rentalMonths?: number; // Количество месяцев аренды
} 