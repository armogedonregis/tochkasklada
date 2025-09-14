import { IsString, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO для обновления ячейки
 */
export class UpdateCellDto {
  /**
   * ID размера ячейки
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  size_id?: string;

  /**
   * Название ячейки (обычно буква)
   * @example "A"
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * ID контейнера, в котором находится ячейка
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  containerId?: string;

  /**
   * ID статуса ячейки
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  statusId?: string;

  /**
   * Комментарий к ячейке
   * @example "Угловая ячейка"
   */
  @IsString()
  @IsOptional()
  comment?: string;
} 