import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAuditService, AuditLogFilters } from '@/common/services/admin-audit.service';
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/apps/auth/guards/roles.guard';
import { Roles } from '@/apps/auth/decorators/roles.decorator';
import { UserRole, AdminAction } from '@prisma/client';

@Controller('admin-audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
export class AdminAuditController {
  constructor(private readonly auditService: AdminAuditService) {}

  /**
   * Получение логов аудита с фильтрацией
   */
  @Get('logs')
  async getAuditLogs(
    @Query('adminId') adminId?: string,
    @Query('entity') entity?: string,
    @Query('entityId') entityId?: string,
    @Query('action') action?: AdminAction,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: AuditLogFilters = {
      adminId,
      entity,
      entityId,
      action,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };

    return this.auditService.getAuditLogs(filters);
  }

  /**
   * Получение статистики аудита
   */
  @Get('stats')
  async getAuditStats(
    @Query('adminId') adminId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.auditService.getAuditStats(
      adminId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  /**
   * Получение истории изменений конкретной сущности
   */
  @Get('entity-history')
  async getEntityHistory(
    @Query('entity') entity: string,
    @Query('entityId') entityId: string,
  ) {
    return this.auditService.getEntityHistory(entity, entityId);
  }

  /**
   * Получение логов конкретного админа
   */
  @Get('admin/:adminId/logs')
  async getAdminLogs(
    @Query('adminId') adminId: string,
    @Query('entity') entity?: string,
    @Query('action') action?: AdminAction,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getAdminLogs(adminId, {
      entity,
      action,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  /**
   * Получение человекочитаемого названия сущности
   */
  @Get('entity-name')
  async getEntityName(
    @Query('entity') entity: string,
    @Query('entityId') entityId: string,
  ) {
    const name = await this.auditService.getEntityName(entity, entityId);
    return { entity, entityId, name };
  }
}
