import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckRelayAccessDto {
  @IsUUID()
  @IsNotEmpty()
  cellRentalId: string;

  @IsUUID()
  @IsNotEmpty()
  relayId: string;
} 