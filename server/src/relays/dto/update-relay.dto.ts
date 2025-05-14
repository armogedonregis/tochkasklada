import { IsString, IsOptional, IsInt, IsUUID, IsEnum, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRelayDto } from './create-relay.dto';
import { RelayType } from '@prisma/client';

/**
 * DTO для обновления реле
 */
export class UpdateRelayDto extends PartialType(CreateRelayDto) {
  /**
   * Название реле
   * @example "Дверь основная"
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Номер реле на панели (от 1 до 16)
   * @example 1
   * @minimum 1
   * @maximum 16
   */
  @IsInt()
  @Min(1)
  @Max(16)
  @IsOptional()
  relayNumber?: number;

  /**
   * Тип реле (SECURITY - дверь, LIGHT - свет, GATE - ворота)
   * @example "SECURITY"
   */
  @IsEnum(RelayType)
  @IsOptional()
  type?: RelayType;

  /**
   * ID панели, к которой привязано реле
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  panelId?: string;

  /**
   * ID ячейки, к которой привязано реле
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  cellId?: string;
} 