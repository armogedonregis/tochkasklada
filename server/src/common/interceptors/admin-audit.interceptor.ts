import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AdminAuditService } from '@/common/services/admin-audit.service';
import { AuditOptions } from '@/common/decorators/audit.decorator';
import { AdminAction } from '@prisma/client';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class AdminAuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AdminAuditService,
    private readonly prisma: PrismaService, // Добавляем PrismaService в конструктор
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('AdminAuditInterceptor: проверка пользователя', { 
      hasUser: !!user, 
      role: user?.role,
      url: request.url,
      method: request.method
    });

    // Пропускаем если пользователь не админ
    if (!user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      console.log('AdminAuditInterceptor: пропуск - пользователь не админ');
      return next.handle();
    }

    // Проверяем декоратор аудита
    const auditOptions = this.reflector.get<AuditOptions>('audit', context.getHandler());
    
    console.log('AdminAuditInterceptor: опции аудита', auditOptions);

    // Если явно пропустить аудит
    if (auditOptions?.skip) {
      console.log('AdminAuditInterceptor: пропуск - skip флаг установлен');
      return next.handle();
    }

    // Если есть переопределение аудита
    if (auditOptions?.action && auditOptions?.entity) {
      console.log('AdminAuditInterceptor: использование кастомного аудита');
      return this.handleCustomAudit(context, next, auditOptions, user, request);
    }

    // Автоматический аудит для стандартных CRUD операций
    console.log('AdminAuditInterceptor: использование автоматического аудита');
    return this.handleAutoAudit(context, next, user, request);
  }

  /**
   * Обработка переопределенного аудита через декоратор
   */
  private handleCustomAudit(
    context: ExecutionContext,
    next: CallHandler,
    auditOptions: AuditOptions,
    user: any,
    request: any
  ): Observable<any> {
    const { action, entity, entityIdParam = 'id', description } = auditOptions;
    
    // Получаем ID сущности из параметров запроса
    const entityId = entityIdParam ? request.params[entityIdParam] : request.params.id;
    
    console.log('Custom audit:', { action, entity, entityId, entityIdParam });

    // Получаем данные до изменения (для UPDATE/DELETE)
    let beforeData: any = null;
    if (['UPDATE', 'DELETE'].includes(action as string)) {
      beforeData = this.getEntityBeforeChange(entity as string, entityId);
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          console.log('Custom audit: обработка ответа', { 
            hasResponse: !!response,
            entityId: entityId || response?.id 
          });

          // Получаем данные после изменения
          const afterData = this.extractAfterData(response, action as AdminAction);
          
          // Получаем adminId из пользователя
          const admin = await this.getAdminByUserId(user.id);
          
          console.log('Custom audit: найден админ', admin);

          if (admin) {
            await this.auditService.logAction(
              admin.id,
              entity as string,
              entityId || response?.id || 'unknown',
              action as AdminAction,
              beforeData,
              afterData,
              {
                ip: request.ip || request.connection?.remoteAddress || null,
                userAgent: request.headers['user-agent'] || null,
                requestId: request.headers['x-request-id'] || null,
              }
            );
            console.log('Custom audit: запись в лог успешно создана');
          }
        } catch (error) {
          // Не прерываем выполнение запроса при ошибке аудита
          console.error('Custom audit logging failed:', error);
        }
      }),
    );
  }

  /**
   * Автоматический аудит для стандартных CRUD операций
   */
  private handleAutoAudit(
    context: ExecutionContext,
    next: CallHandler,
    user: any,
    request: any
  ): Observable<any> {
    const method = request.method;
    const url = request.url;
    
    // Определяем действие по HTTP методу
    const action = this.getActionFromMethod(method);
    if (!action) {
      console.log('Auto audit: действие не определено для метода', method);
      return next.handle();
    }
    
    // Определяем сущность по URL
    const entity = this.getEntityFromUrl(url);
    if (!entity) {
      console.log('Auto audit: сущность не определена для URL', url);
      return next.handle();
    }

    // Получаем ID сущности
    const entityId = request.params.id;
    
    console.log('Auto audit:', { action, entity, entityId, method, url });

    // Получаем данные до изменения (для UPDATE/DELETE)
    let beforeData: any = null;
    if (['UPDATE', 'DELETE'].includes(action)) {
      beforeData = this.getEntityBeforeChange(entity, entityId);
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          console.log('Auto audit: обработка ответа', { 
            hasResponse: !!response,
            entityId: entityId || response?.id 
          });

          // Получаем данные после изменения
          const afterData = this.extractAfterData(response, action);
          
          // Получаем adminId из пользователя
          const admin = await this.getAdminByUserId(user.id);
          
          console.log('Auto audit: найден админ', admin);

          if (admin) {
            await this.auditService.logAction(
              admin.id,
              entity,
              entityId || response?.id || 'unknown',
              action,
              beforeData,
              afterData,
              {
                ip: request.ip || request.connection?.remoteAddress || null,
                userAgent: request.headers['user-agent'] || null,
                requestId: request.headers['x-request-id'] || null,
              }
            );
            console.log('Auto audit: запись в лог успешно создана');
          }
        } catch (error) {
          // Не прерываем выполнение запроса при ошибке аудита
          console.error('Auto audit logging failed:', error);
        }
      }),
    );
  }

  /**
   * Определение действия по HTTP методу
   */
  private getActionFromMethod(method: string): AdminAction | null {
    const actionMap = {
      'POST': AdminAction.CREATE,
      'PUT': AdminAction.UPDATE,
      'PATCH': AdminAction.UPDATE,
      'DELETE': AdminAction.DELETE,
    };
    
    return actionMap[method] || null;
  }

  /**
   * Определение сущности по URL
   */
  private getEntityFromUrl(url: string): string | null {
    const urlPatterns = [
      { pattern: /\/admin\/cells/, entity: 'cells' },
      { pattern: /\/admin\/clients/, entity: 'clients' },
      { pattern: /\/admin\/locations/, entity: 'locations' },
      { pattern: /\/admin\/containers/, entity: 'containers' },
      { pattern: /\/admin\/sizes/, entity: 'sizes' },
      { pattern: /\/admin\/rentals/, entity: 'rentals' },
      { pattern: /\/admin\/admins/, entity: 'admins' },
      { pattern: /\/admin\/roles/, entity: 'roles' },
      { pattern: /\/admin\/users/, entity: 'users' },
    ];

    const matchedPattern = urlPatterns.find(pattern => pattern.pattern.test(url));
    return matchedPattern ? matchedPattern.entity : null;
  }

  /**
   * Получение данных сущности до изменения
   */
  private async getEntityBeforeChange(entity: string, entityId: string): Promise<any> {
    if (!entityId) {
      console.log('getEntityBeforeChange: entityId не предоставлен');
      return null;
    }
    
    try {
      const modelName = this.getModelName(entity);
      console.log('getEntityBeforeChange: поиск данных', { modelName, entityId });

      if (!this.prisma[modelName]) {
        console.log('getEntityBeforeChange: модель не найдена в Prisma', modelName);
        return null;
      }

      const data = await this.prisma[modelName].findUnique({
        where: { id: entityId },
      });
      
      console.log('getEntityBeforeChange: данные найдены', !!data);
      return data;
    } catch (error) {
      console.error('getEntityBeforeChange: ошибка при получении данных', error);
      return null;
    }
  }

  /**
   * Извлечение данных после изменения
   */
  private extractAfterData(response: any, action: AdminAction): any {
    if (action === 'CREATE' || action === 'UPDATE') {
      // Если response уже содержит данные сущности
      if (response && typeof response === 'object') {
        return response;
      }
    }
    return null;
  }

  /**
   * Получение админа по userId
   */
  private async getAdminByUserId(userId: string): Promise<{ id: string } | null> {
    try {
      console.log('getAdminByUserId: поиск админа для userId', userId);
      
      const admin = await this.prisma.admin.findUnique({
        where: { userId },
        select: { id: true },
      });
      
      console.log('getAdminByUserId: результат поиска', admin);
      return admin;
    } catch (error) {
      console.error('getAdminByUserId: ошибка при поиске админа', error);
      return null;
    }
  }

  /**
   * Маппинг имен сущностей на модели Prisma
   */
  private getModelName(entity: string): string {
    const entityMap: Record<string, string> = {
      'cells': 'cell',
      'clients': 'client',
      'locations': 'location',
      'containers': 'container',
      'sizes': 'size',
      'rentals': 'cellRental',
      'admins': 'admin',
      'roles': 'role',
      'users': 'user',
    };
    
    const modelName = entityMap[entity.toLowerCase()] || entity.toLowerCase();
    console.log('getModelName: маппинг', { entity, modelName });
    
    return modelName;
  }
}