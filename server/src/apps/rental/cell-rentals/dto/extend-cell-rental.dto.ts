import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ExtendCellRentalDto {
  @IsNotEmpty()
  @IsUUID()
  cellRentalId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  months?: number = 1; // По умолчанию продление на 1 месяц

  @IsOptional()
  @IsNumber()
  @Min(1)
  rentalDuration?: number; // Срок продления в днях
} 