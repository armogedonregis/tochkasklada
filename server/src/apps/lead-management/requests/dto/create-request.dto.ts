import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sizeform?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  comment?: string;
} 