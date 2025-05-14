import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * DTO для формы с лендинга
 */
export class LandingFormDto {
  /**
   * Имя клиента
   * @example "Иван Иванов"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Email клиента
   * @example "client@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Телефон клиента
   * @example "79001234567"
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^7\d{10}$/, { message: 'Телефон должен быть в формате 7XXXXXXXXXX' })
  phone: string;
} 