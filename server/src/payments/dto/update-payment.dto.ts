import { IsOptional, IsNumber, IsString, IsBoolean, IsUUID, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
  
  // Поля для работы с арендой ячейки
  @IsOptional()
  @IsUUID()
  cellRentalId?: string;    // ID существующей аренды для привязки

  @IsOptional()
  @IsUUID()
  cellId?: string;          // ID ячейки (для создания новой аренды)

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  rentalDays?: number;    // Количество месяцев аренды

  @IsOptional()
  @IsBoolean()
  extendRental?: boolean;   // Продлить связанную аренду

  @IsOptional()
  @IsBoolean()
  detachRental?: boolean;   // Отвязать от аренды
  
  // Поля для корректировки дат аренды
  @IsOptional()
  @IsDateString()
  rentalStartDate?: string; // Новая дата начала аренды (формат: "YYYY-MM-DD")

  @IsOptional()
  @IsDateString()
  rentalEndDate?: string;   // Новая дата окончания аренды (формат: "YYYY-MM-DD")
} 