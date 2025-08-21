import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';
import { CreateRoleDto, UpdateRoleDto, AssignLocationPermissionsDto } from './dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  // Получить все роли
  async findAll() {
    return this.prisma.role.findMany({
      where: {
        name: { not: 'SUPERADMIN' }
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            adminRoles: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Получить роль по ID
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            adminRoles: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Роль с ID ${id} не найдена`);
    }

    return role;
  }

  // Создать новую роль
  async create(data: CreateRoleDto) {
    // Запрещаем создание роли с именем SUPERADMIN
    if (data.name.toUpperCase() === 'SUPERADMIN') {
      throw new BadRequestException(`Нельзя создать роль с именем "SUPERADMIN"`);
    }

    // Проверяем, что роль с таким именем не существует
    const existingRole = await this.prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new BadRequestException(`Роль с именем "${data.name}" уже существует`);
    }

    return this.prisma.$transaction(async (prisma) => {
      // Создаем роль
      const role = await prisma.role.create({
        data: {
          name: data.name,
          description: data.description,
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
          _count: {
            select: {
              adminRoles: true,
            },
          },
        },
      });

      // Если указаны права, назначаем их
      if (data.permissionIds && data.permissionIds.length > 0) {
        for (const permissionId of data.permissionIds) {
          await prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId,
            },
          });
        }
      }

      return role;
    });
  }

  // Обновить роль
  async update(id: string, data: UpdateRoleDto) {
    const role = await this.findOne(id);

    // Запрещаем переименование в SUPERADMIN
    if (data.name && data.name.toUpperCase() === 'SUPERADMIN') {
      throw new BadRequestException(`Нельзя переименовать роль в "SUPERADMIN"`);
    }

    // Проверяем, что новая роль не конфликтует с существующей
    if (data.name && data.name !== role.name) {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: data.name },
      });

      if (existingRole) {
        throw new BadRequestException(`Роль с именем "${data.name}" уже существует`);
      }
    }

    return this.prisma.$transaction(async (prisma) => {
      // Обновляем роль
      if (data.name || data.description !== undefined) {
        await prisma.role.update({
          where: { id },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
          },
        });
      }

      // Если указаны права, обновляем их
      if (data.permissionIds !== undefined) {
        // Удаляем все текущие права
        await prisma.rolePermission.deleteMany({
          where: { roleId: id },
        });

        // Добавляем новые права
        if (data.permissionIds.length > 0) {
          for (const permissionId of data.permissionIds) {
            await prisma.rolePermission.create({
              data: {
                roleId: id,
                permissionId,
              },
            });
          }
        }
      }

      return this.findOne(id);
    });
  }

  // Удалить роль
  async remove(id: string) {
    const role = await this.findOne(id);

    // Дополнительная проверка - нельзя удалить роль SUPERADMIN
    if (role.name === 'SUPERADMIN') {
      throw new BadRequestException(`Роль "SUPERADMIN" не может быть удалена`);
    }

    // Проверяем, что роль не используется админами
    if (role._count.adminRoles > 0) {
      throw new BadRequestException(`Нельзя удалить роль "${role.name}", так как она назначена ${role._count.adminRoles} администраторам`);
    }

    // Удаляем все права роли
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // Удаляем роль
    await this.prisma.role.delete({
      where: { id },
    });

    return { message: `Роль "${role.name}" успешно удалена` };
  }

  // Получить все права
  async findAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { key: 'asc' },
    });
  }

  // Получить права по категориям
  async getPermissionsByCategory() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: { key: 'asc' },
    });

    // Группируем права по категориям
    const categories: Record<string, any[]> = {};
    
    permissions.forEach(permission => {
      const [category] = permission.key.split(':');
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(permission);
    });

    return categories;
  }

  // Назначить права на конкретную локацию
  async assignLocationPermissions(dto: AssignLocationPermissionsDto) {
    // Проверяем, что админ существует
    const admin = await this.prisma.admin.findUnique({
      where: { id: dto.adminId },
    });

    if (!admin) {
      throw new NotFoundException(`Администратор с ID ${dto.adminId} не найден`);
    }

    // Проверяем, что локация существует
    const location = await this.prisma.location.findUnique({
      where: { id: dto.locationId },
    });

    if (!location) {
      throw new NotFoundException(`Локация с ID ${dto.locationId} не найдена`);
    }

    // Получаем ID permissions по ключам
    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: dto.permissions } },
    });

    if (permissions.length !== dto.permissions.length) {
      const foundKeys = permissions.map(p => p.key);
      const missingKeys = dto.permissions.filter(key => !foundKeys.includes(key));
      throw new BadRequestException(`Не найдены permissions: ${missingKeys.join(', ')}`);
    }

    // Удаляем существующие права на эту локацию для данного админа
    await this.prisma.adminResourcePermission.deleteMany({
      where: {
        adminId: dto.adminId,
        resourceType: 'Location',
        resourceId: dto.locationId,
      },
    });

    // Создаем новые права на локацию
    const resourcePermissions = await Promise.all(
      permissions.map(permission =>
        this.prisma.adminResourcePermission.create({
          data: {
            adminId: dto.adminId,
            permissionId: permission.id,
            resourceType: 'Location',
            resourceId: dto.locationId,
          },
        })
      )
    );

    return {
      message: `Права на локацию "${location.name}" успешно назначены администратору`,
      adminId: dto.adminId,
      locationId: dto.locationId,
      permissions: dto.permissions,
      resourcePermissions: resourcePermissions.length,
    };
  }

  // Получить права оператора на локации
  async getAdminLocationPermissions(adminId: string) {
    // Проверяем, что админ существует
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException(`Администратор с ID ${adminId} не найден`);
    }

    // Получаем все права на локации для данного админа
    const locationPermissions = await this.prisma.adminResourcePermission.findMany({
      where: {
        adminId,
        resourceType: 'Location',
      },
      include: {
        permission: true,
      },
    });

    // Группируем по локациям
    const permissionsByLocation = locationPermissions.reduce((acc, perm) => {
      const locationId = perm.resourceId;
      if (!acc[locationId]) {
        acc[locationId] = {
          locationId: locationId,
          permissions: [],
        };
      }
      acc[locationId].permissions.push(perm.permission.key);
      return acc;
    }, {});

    return Object.values(permissionsByLocation);
  }
}
