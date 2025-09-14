import { IsString, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO для создания ячейки
 */
export class CreateCellDto {
  /**
   * ID размера ячейки
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  size_id: string;

  /**
   * Название ячейки (обычно буква)
   * @example "A"
   */
  @IsString()
  name: string;

  /**
   * ID контейнера, в котором находится ячейка
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  containerId: string;

  /**
   * Комментарий к ячейке
   * @example "Угловая ячейка"
   */
  @IsString()
  @IsOptional()
  comment?: string;
} 