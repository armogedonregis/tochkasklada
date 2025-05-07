export class CreateAdminPaymentDto {
  // Общие поля платежа
  amount: number;
  description?: string;
  userId: string;
  status?: boolean;
  tinkoffPaymentId?: string;
  paymentUrl?: string;
  
  // Поля для аренды ячейки
  cellId?: string;        // ID ячейки для аренды
  rentalMonths?: number;  // Количество месяцев аренды
  statusId?: string;      // ID статуса ячейки
} 