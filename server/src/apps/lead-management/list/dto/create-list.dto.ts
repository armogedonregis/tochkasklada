import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateListDto {
  @IsOptional()
  @IsEmail() 
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsString()
  sizeId?: string;
} 