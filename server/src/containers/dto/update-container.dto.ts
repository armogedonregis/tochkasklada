import { IsInt, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCellDto } from './create-container.dto';

/**
 * DTO для обновления контейнера
 */
export class UpdateContainerDto {
  /**
   * Номер контейнера (уникальная нумерация) - можно изменить
   * @example 5
   */
  @IsInt()
  @IsOptional()
  name?: number;
  
  /**
   * ID локации, к которой привязан контейнер
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  locId?: string;

  /**
   * Массив ячеек, которые должны присутствовать в контейнере
   * Ячейки, которых нет в этом массиве, будут удалены
   * @example [{"name": "A", "size_id": "550e8400-e29b-41d4-a716-446655440000"}]
   */
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateCellDto)
  cells?: CreateCellDto[];
} 