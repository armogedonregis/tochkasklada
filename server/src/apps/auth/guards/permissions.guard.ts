import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

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

    // Получаем профиль админа
    const admin = await this.prisma.admin.findUnique({
      where: { userId: user.id },
      include: {
        adminRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        adminPermissions: {
          include: {
            permission: true,
          },
        },
        adminResourcePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!admin) {
      throw new ForbiddenException('Профиль администратора не найден');
    }

    // Собираем все права админа
    const userPermissions = new Set<string>();

    // Права из ролей
    admin.adminRoles.forEach(adminRole => {
      adminRole.role.rolePermissions.forEach(rolePermission => {
        userPermissions.add(rolePermission.permission.key);
      });
    });

    // Прямые права
    admin.adminPermissions.forEach(adminPermission => {
      userPermissions.add(adminPermission.permission.key);
    });

    // Проверяем, есть ли у пользователя все необходимые права
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.has(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Недостаточно прав. Требуются: ${requiredPermissions.join(', ')}`
      );
    }

    // Если указан ресурс, проверяем права на него
    if (resourceType && resourceIdParam) {
      const resourceId = request.params[resourceIdParam];
      
      if (resourceId) {
        // Проверяем, есть ли у админа права на этот конкретный ресурс
        const hasResourcePermission = await this.checkResourcePermission(
          admin.id, 
          requiredPermissions[0], 
          resourceType, 
          resourceId
        );
        
        // Если нет прав на конкретный ресурс, но есть общий permission - разрешаем
        // Это позволяет видеть все ресурсы, но управлять только теми, на которые есть права
        if (!hasResourcePermission) {
          // Проверяем, есть ли у админа общий permission на этот тип ресурса
          const hasGeneralPermission = userPermissions.has(requiredPermissions[0]);
          
          if (!hasGeneralPermission) {
            throw new ForbiddenException(
              `Нет прав на ресурс ${resourceType}:${resourceId}`
            );
          }
        }
      }
    }

    return true;
  }

  private async checkResourcePermission(
    adminId: string, 
    permission: string, 
    resourceType: string, 
    resourceId: string
  ): Promise<boolean> {
    // Проверяем прямые права на ресурс
    const directPermission = await this.prisma.adminResourcePermission.findUnique({
      where: {
        adminId_permissionId_resourceType_resourceId: {
          adminId,
          permissionId: await this.getPermissionId(permission),
          resourceType,
          resourceId,
        },
      },
    });
    
    if (directPermission) return true;
    
    // Проверяем права на родительские ресурсы (иерархия)
    const parentPermission = await this.findParentPermission(
      adminId, 
      permission, 
      resourceType, 
      resourceId
    );
    
    return !!parentPermission;
  }

  private async findParentPermission(
    adminId: string, 
    permission: string, 
    resourceType: string, 
    resourceId: string
  ): Promise<boolean> {
    // Определяем иерархию ресурсов
    const resourceHierarchy = {
      'Cell': ['Container', 'Location'],
      'Container': ['Location'],
      'CellRental': ['Cell', 'Container', 'Location'],
      'Payment': ['CellRental', 'Cell', 'Container', 'Location'],
      'Client': ['CellRental', 'Cell', 'Container', 'Location'],
    };

    const hierarchy = resourceHierarchy[resourceType] || [];
    
    for (const parentType of hierarchy) {
      const parentId = await this.getParentResourceId(resourceType, resourceId, parentType);
      
      if (parentId) {
        const parentPermission = await this.prisma.adminResourcePermission.findUnique({
          where: {
            adminId_permissionId_resourceType_resourceId: {
              adminId,
              permissionId: await this.getPermissionId(permission),
              resourceType: parentType,
              resourceId: parentId,
            },
          },
        });
        
        if (parentPermission) return true;
      }

    }
    
    return false;
  }

  private async getParentResourceId(
    resourceType: string, 
    resourceId: string, 
    parentType: string
  ): Promise<string | null> {
    // Получаем ID родительского ресурса
    switch (resourceType) {
      case 'Cell':
        if (parentType === 'Container') {
          const cell = await this.prisma.cells.findUnique({
            where: { id: resourceId },
            select: { containerId: true }
          });
          return cell?.containerId || null;
        }
        if (parentType === 'Location') {
          const cell = await this.prisma.cells.findUnique({
            where: { id: resourceId },
            include: { container: true }
          });
          return cell?.container?.locId || null;
        }
        break;
        
      case 'Container':
        if (parentType === 'Location') {
          const container = await this.prisma.containers.findUnique({
            where: { id: resourceId },
            select: { locId: true }
          });
          return container?.locId || null;
        }
        break;
        
      case 'CellRental':
        if (parentType === 'Cell') {
          const rental = await this.prisma.cellRental.findUnique({
            where: { id: resourceId },
            select: { cellId: true }
          });
          return rental?.cellId || null;
        }
        break;
    }
    
    return null;
  }

  private async getPermissionId(permissionKey: string): Promise<string> {
    const permission = await this.prisma.permission.findUnique({
      where: { key: permissionKey },
    });
    
    if (!permission) {
      throw new ForbiddenException(`Permission ${permissionKey} не найден`);
    }
    
    return permission.id;
  }
}
