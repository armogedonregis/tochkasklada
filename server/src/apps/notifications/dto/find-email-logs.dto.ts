import { IsOptional, IsEnum, IsString } from 'class-validator';
import { EmailType, EmailStatus } from '@prisma/client';

export class FindEmailLogsDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsEnum(EmailType)
  type?: EmailType;

  @IsOptional()
  @IsEnum(EmailStatus)
  status?: EmailStatus;

  @IsOptional()
  @IsString()
  rentalId?: string;
}