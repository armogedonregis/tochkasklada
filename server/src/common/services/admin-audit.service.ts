import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { AdminAction, Prisma } from '@prisma/client';

export interface AuditLogFilters {
  adminId?: string;
  entity?: string;
  entityId?: string;
  action?: AdminAction;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  data: any[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class AdminAuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Получение логов аудита с фильтрацией и пагинацией
   */
  async getAuditLogs(filters: AuditLogFilters): Promise<AuditLogResponse> {
    const {
      adminId,
      entity,
      entityId,
      action,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = filters;

    const where: Prisma.AdminAuditLogWhereInput = {};

    if (adminId) {
      where.adminId = adminId;
    }

    if (entity) {
      where.entity = entity;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (action) {
      where.action = action;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        where.createdAt.lte = dateTo;
      }
    }

    const skip = (page - 1) * limit;

    try {
      const [logs, totalCount] = await Promise.all([
        this.prisma.adminAuditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            admin: {
              include: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.adminAuditLog.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: logs,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get audit logs: ${error.message}`,
        error.stack,
        'AdminAuditService',
      );
      throw error;
    }
  }

  /**
   * Получение статистики аудита
   */
  async getAuditStats(adminId?: string, dateFrom?: Date, dateTo?: Date) {
    const where: Prisma.AdminAuditLogWhereInput = {};

    if (adminId) {
      where.adminId = adminId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        where.createdAt.lte = dateTo;
      }
    }

    try {
      const [
        totalActions,
        actionsByType,
        actionsByEntity,
        recentActions,
      ] = await Promise.all([
        this.prisma.adminAuditLog.count({ where }),
        this.prisma.adminAuditLog.groupBy({
          by: ['action'],
          where,
          _count: { action: true },
        }),
        this.prisma.adminAuditLog.groupBy({
          by: ['entity'],
          where,
          _count: { entity: true },
        }),
        this.prisma.adminAuditLog.findMany({
          where,
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            admin: {
              include: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      return {
        totalActions,
        actionsByType: actionsByType.map(item => ({
          action: item.action,
          count: item._count.action,
        })),
        actionsByEntity: actionsByEntity.map(item => ({
          entity: item.entity,
          count: item._count.entity,
        })),
        recentActions,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get audit stats: ${error.message}`,
        error.stack,
        'AdminAuditService',
      );
      throw error;
    }
  }

  /**
   * Получение истории изменений конкретной сущности
   */
  async getEntityHistory(entity: string, entityId: string) {
    try {
      const logs = await this.prisma.adminAuditLog.findMany({
        where: {
          entity,
          entityId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      return logs;
    } catch (error) {
      this.logger.error(
        `Failed to get entity history: ${error.message}`,
        error.stack,
        'AdminAuditService',
      );
      throw error;
    }
  }

  /**
   * Получение логов конкретного админа
   */
  async getAdminLogs(adminId: string, filters?: Omit<AuditLogFilters, 'adminId'>) {
    return this.getAuditLogs({ ...filters, adminId });
  }

  /**
   * Ручное логирование действия (для случаев, когда нужен точный контроль)
   */
  async logAction(
    adminId: string,
    entity: string,
    entityId: string,
    action: AdminAction,
    beforeData?: any,
    afterData?: any,
    requestContext?: { ip?: string; userAgent?: string; requestId?: string }
  ) {
    try {
      return await this.prisma.adminAuditLog.create({
        data: {
          adminId,
          entity,
          entityId,
          action,
          before: beforeData,
          after: afterData,
          requestId: requestContext?.requestId || null,
          ip: requestContext?.ip || null,
          userAgent: requestContext?.userAgent || null,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to log audit action: ${error.message}`,
        error.stack,
        'AdminAuditService',
      );
      throw error;
    }
  }

  /**
   * Получение человекочитаемого названия сущности
   */
  async getEntityName(entity: string, entityId: string): Promise<string> {
    try {
      const modelName = this.getModelName(entity);
      
      switch (entity) {
        case 'cells':
          const cell = await this.prisma.cells.findUnique({
            where: { id: entityId },
            select: { 
              name: true, 
              container: { 
                select: { 
                  name: true,
                  location: {
                    select: {
                      name: true,
                      city: { select: { title: true } }
                    }
                  }
                } 
              } 
            }
          });
          return cell ? `Ячейка ${cell.name} (${cell.container.name}, ${cell.container.location?.name})` : 'Неизвестная ячейка';
          
        case 'clients':
          const client = await this.prisma.client.findUnique({
            where: { id: entityId },
            select: { name: true }
          });
          return client ? `Клиент ${client.name}` : 'Неизвестный клиент';
          
        case 'locations':
          const location = await this.prisma.location.findUnique({
            where: { id: entityId },
            select: { name: true, city: { select: { title: true } } }
          });
          return location ? `Локация ${location.name} (${location.city.title})` : 'Неизвестная локация';
          
        case 'containers':
          const container = await this.prisma.containers.findUnique({
            where: { id: entityId },
            select: { name: true, location: { select: { name: true } } }
          });
          return container ? `Контейнер ${container.name} (${container.location?.name})` : 'Неизвестный контейнер';
          
        case 'sizes':
          const size = await this.prisma.sizeCells.findUnique({
            where: { id: entityId },
            select: { name: true, short_name: true }
          });
          return size ? `Размер ${size.name} (${size.short_name})` : 'Неизвестный размер';
          
        default:
          return `${entity} ${entityId}`;
      }
    } catch (error) {
      this.logger.error(
        `Failed to get entity name: ${error.message}`,
        error.stack,
        'AdminAuditService',
      );
      return `${entity} ${entityId}`;
    }
  }

  /**
   * Маппинг имен сущностей на модели Prisma
   */
  private getModelName(entity: string): string {
    const entityMap: Record<string, string> = {
      'cells': 'cells',
      'clients': 'clients',
      'locations': 'locations',
      'containers': 'containers',
      'sizes': 'sizes',
      'rentals': 'cellRental',
      'admins': 'admins',
      'roles': 'roles',
      'users': 'users',
    };
    
    return entityMap[entity.toLowerCase()] || entity.toLowerCase();
  }
}
