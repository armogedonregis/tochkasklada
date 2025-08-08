import { IsOptional, IsString } from 'class-validator';

export class CloseRequestDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  locationId?: string; // Для переноса в конкретную локацию
} 