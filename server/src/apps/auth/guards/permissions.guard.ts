import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const resourceType = this.reflector.get<string>('resourceType', context.getHandler());
    const resourceIdParam = this.reflector.get<string>('resourceIdParam', context.getHandler());
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не аутентифицирован');
    }

    // SUPERADMIN имеет полный доступ ко всему - проверяем первым
    if (user.role === 'SUPERADMIN') {
      return true;
    }
    
    // Если права не указаны, проверяем только аутентификацию
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Если пользователь не админ, запрещаем доступ
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Доступ запрещен');
    }

    // Получаем профиль админа с ролями и ресурсным скоупом
    const admin = await this.prisma.admin.findUnique({
      where: { userId: user.id },
      include: {
        role: { include: { permissions: true } },
        adminResourcePermissions: true,
      },
    });

    if (!admin) {
      throw new ForbiddenException('Профиль администратора не найден');
    }

    // Собираем все права админа из назначенных ролей
    const userPermissions = new Set<string>();
    if (admin.role) {
      admin.role.permissions.forEach(permission => {
        userPermissions.add(permission.key);
      });
    }

    // Проверяем, есть ли у пользователя все необходимые права
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.has(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Недостаточно прав. Требуются: ${requiredPermissions.join(', ')}`
      );
    }

    // Если указан ресурс, формируем скоуп и (если есть resourceId) проверяем доступ к конкретной записи
    if (resourceType) {
      // Всегда формируем список доступных ID для последующей фильтрации в сервисах
      const scopeIds = await this.getAccessibleResourceIds(admin.id, resourceType);
      request.resourceScope = { ...(request.resourceScope || {}), [resourceType]: scopeIds };

      if (resourceIdParam) {
        const resourceId = request.params[resourceIdParam];
        if (resourceId) {
          const hasResourceAccess = await this.checkResourceScope(
            admin.id,
            resourceType,
            resourceId
          );
          if (!hasResourceAccess) {
            throw new ForbiddenException(
              `Нет доступа к ресурсу ${resourceType}:${resourceId}`
            );
          }
        }
      }
    }

    return true;
  }

  private async checkResourceScope(
    adminId: string,
    resourceType: string,
    resourceId: string
  ): Promise<boolean> {
    // Проверяем прямой доступ к ресурсу (без наследования)
    const direct = await this.prisma.adminResourcePermission.findUnique({
      where: {
        adminId_resourceType_resourceId: {
          adminId,
          resourceType,
          resourceId,
        },
      },
    });
    if (direct) return true;
    return false;
  }

  private async getAccessibleResourceIds(
    adminId: string,
    resourceType: string,
  ): Promise<string[] | 'ALL'> {
    // В дальнейшем можно расширить для разных типов
    if (resourceType === 'Location') {
      const perms = await this.prisma.adminResourcePermission.findMany({
        where: { adminId, resourceType: 'Location' },
        select: { resourceId: true },
      });
      return Array.from(new Set(perms.map(p => p.resourceId)));
    }
    // По умолчанию возвращаем пустой список
    return [];
  }


  // Больше не нужно, т.к. scope не хранит permissionId
}
