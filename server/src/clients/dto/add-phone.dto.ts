import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';

/**
 * DTO для добавления телефона клиенту
 */
export class AddPhoneDto {
  /**
   * Номер телефона клиента
   * @example "79001234567"
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^7\d{10}$/, { message: 'Телефон должен быть в формате 7XXXXXXXXXX' })
  phone: string;

  /**
   * Комментарий к телефону
   * @example "Рабочий номер"
   */
  @IsString()
  @IsOptional()
  comment?: string;
} 