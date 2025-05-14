import { IsBoolean, IsNotEmpty } from 'class-validator';

/**
 * DTO для включения/выключения реле
 */
export class ToggleRelayDto {
  /**
   * Новое состояние реле (true - включить, false - выключить)
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  state: boolean;
} 