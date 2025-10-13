import { IsOptional, IsNumber, IsString, IsBoolean, IsUUID, Min, IsDateString, IsArray } from 'class-validator';
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
  @IsUUID()
  userId?: string; 
  
  @IsOptional()
  @IsUUID()
  cellRentalId?: string;

  @IsOptional()
  @IsUUID()
  cellId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  cellIds?: string[];
  
  @IsOptional()
  @IsDateString()
  rentalStartDate?: string;

  @IsOptional()
  @IsDateString()
  rentalEndDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  rentalDuration?: number;
} 