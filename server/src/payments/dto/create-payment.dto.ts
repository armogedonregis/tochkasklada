import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  userId?: string; // Автоматически добавляется из req.user.id в контроллере

  @IsOptional()
  @IsUUID()
  cellId?: string; // ID ячейки для аренды

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  rentalMonths?: number; // Количество месяцев аренды
} 