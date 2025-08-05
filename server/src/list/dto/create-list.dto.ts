import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateListDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  name: string;

  @IsString()
  source: string; // "Tilda-Cart", "Tilda-Contact", "Manual"

  @IsOptional()
  @IsString()
  description?: string;
} 