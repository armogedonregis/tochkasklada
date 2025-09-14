import { IsString, IsOptional, IsInt, Min, Max, Matches } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePanelDto } from './create-panel.dto';

/**
 * DTO для обновления панели
 */
export class UpdatePanelDto extends PartialType(CreatePanelDto) {
  /**
   * Название панели
   * @example "Панель контроля доступа"
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * IP-адрес панели
   * @example "192.168.1.100"
   */
  @IsString()
  @IsOptional()
  @Matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, { 
    message: 'Неверный формат IP-адреса' 
  })
  ipAddress?: string;

  /**
   * Порт подключения к панели
   * @example 8080
   * @minimum 1
   * @maximum 65535
   */
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  port?: number;

  /**
   * Логин для аутентификации на панели
   * @example "admin"
   */
  @IsString()
  @IsOptional()
  login?: string;

  /**
   * Пароль для аутентификации на панели
   * @example "password123"
   */
  @IsString()
  @IsOptional()
  password?: string;
} 