import { SetMetadata } from '@nestjs/common';
import { AdminAction } from '@prisma/client';

export interface AuditOptions {
  action?: AdminAction;
  entity?: string;
  entityIdParam?: string;
  description?: string;
  skip?: boolean; // Пропустить аудит
}

/**
 * Универсальный декоратор для аудита админов
 * 
 * @param options - Опции аудита
 * @param options.action - Тип действия (CREATE, UPDATE, DELETE, etc.)
 * @param options.entity - Название сущности (например, 'cells', 'clients')
 * @param options.entityIdParam - Параметр запроса, содержащий ID сущности (по умолчанию 'id')
 * @param options.description - Описание действия для логов
 * @param options.skip - Пропустить аудит для этого метода
 * 
 * @example
 * ```typescript
 * // Автоматический аудит (через интерцептор)
 * @Post()
 * async create(@Body() dto: CreateDto) { ... }
 * 
 * // Переопределенный аудит
 * @Post('bulk')
 * @Audit({ 
 *   action: AdminAction.CREATE, 
 *   entity: 'cells', 
 *   description: 'Массовое создание ячеек' 
 * })
 * async createBulk(@Body() dto: CreateBulkDto) { ... }
 * 
 * // Пропуск аудита
 * @Get('public')
 * @Audit({ skip: true })
 * async getPublicData() { ... }
 * ```
 */
export const Audit = (options: AuditOptions) => SetMetadata('audit', options);

/**
 * Короткая запись для пропуска аудита
 */
export const SkipAudit = () => Audit({ skip: true });

/**
 * Короткая запись для переопределения действия
 */
export const AuditAction = (action: AdminAction, entity: string, description?: string) => 
  Audit({ action, entity, description });
