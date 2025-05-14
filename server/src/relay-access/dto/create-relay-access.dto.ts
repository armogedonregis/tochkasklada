import { IsString, IsNotEmpty, IsUUID, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRelayAccessDto {
  @IsUUID()
  @IsNotEmpty()
  relayId: string;

  @IsUUID()
  @IsOptional()
  cellRentalId?: string;

  @IsDate()
  @Type(() => Date)
  validUntil: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 