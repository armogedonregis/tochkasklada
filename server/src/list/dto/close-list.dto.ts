import { IsString, IsNotEmpty } from 'class-validator';

export class CloseListDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
} 