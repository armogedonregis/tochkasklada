import { IsInt, IsOptional, IsUUID, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для создания ячейки внутри контейнера
 */
export class CreateCellDto {
  /**
   * Буква ячейки (A, B, C, D, E, F, G, H)
   * @example "A"
   */
  @IsString()
  name: string;

  /**
   * ID размера ячейки
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  size_id: string;
}

/**
 * DTO для создания контейнера
 */
export class CreateContainerDto {
  /**
   * Номер контейнера (уникальная нумерация)
   * @example 1
   */
  @IsInt()
  name: number;

  /**
   * ID локации, к которой привязан контейнер
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID()
  @IsOptional()
  locId?: string;

  /**
   * Массив ячеек для создания внутри контейнера
   * @example [{"name": "A", "size_id": "550e8400-e29b-41d4-a716-446655440000"}]
   */
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateCellDto)
  cells?: CreateCellDto[];
} 