import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID, IsInt, Min, IsBoolean, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdminPaymentDto {
  // Общие поля платежа
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  tinkoffPaymentId?: string;

  @IsOptional()
  @IsUrl()
  paymentUrl?: string;
  
  // Поля для аренды ячейки
  @IsOptional()
  @IsUUID()
  cellId?: string;        // ID ячейки для аренды

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  rentalDays?: number;  // Количество месяцев аренды

  @IsOptional()
  @IsUUID()
  statusId?: string;      // ID статуса ячейки
} 