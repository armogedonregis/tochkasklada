import { IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindGanttRentalsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}