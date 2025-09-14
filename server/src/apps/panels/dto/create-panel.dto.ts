import { IsString, IsNotEmpty, IsInt, Min, Max, Matches } from 'class-validator';

/**
 * DTO для создания панели
 */
export class CreatePanelDto {
  /**
   * Название панели
   * @example "Панель контроля доступа"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * IP-адрес панели
   * @example "192.168.1.100"
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, { 
    message: 'Неверный формат IP-адреса' 
  })
  ipAddress: string;

  /**
   * Порт подключения к панели
   * @example 8080
   * @minimum 1
   * @maximum 65535
   */
  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;

  /**
   * Логин для аутентификации на панели
   * @example "admin"
   */
  @IsString()
  @IsNotEmpty()
  login: string;

  /**
   * Пароль для аутентификации на панели
   * @example "password123"
   */
  @IsString()
  @IsNotEmpty()
  password: string;
} 