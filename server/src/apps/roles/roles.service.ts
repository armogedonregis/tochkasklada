import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
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
       
      },
      orderBy: { name: 'asc' },
    });
  }

  // Получить роль по ID
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
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
      });


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

    return {
      message: `Права на локацию "${location.name}" успешно назначены администратору`,
      adminId: dto.adminId,
      locationId: dto.locationId,
      permissions: dto.permissions
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
      acc[locationId].permissions.push(perm.resourceId);
      return acc;
    }, {});

    return Object.values(permissionsByLocation);
  }

  /**
   * Массово назначает администратору набор локаций и прав на них
   */
  async assignAdminLocations(dto: { adminId: string; locationIds: string[]; permissions: string[] }) {
    // Валидация админа
    const admin = await this.prisma.admin.findUnique({ where: { id: dto.adminId } });
    if (!admin) {
      throw new NotFoundException(`Администратор с ID ${dto.adminId} не найден`);
    }

    // Валидация локаций
    const locations = await this.prisma.location.findMany({ where: { id: { in: dto.locationIds } }, select: { id: true } });
    if (locations.length !== dto.locationIds.length) {
      const found = locations.map(l => l.id);
      const missing = dto.locationIds.filter(id => !found.includes(id));
      throw new NotFoundException(`Локации не найдены: ${missing.join(', ')}`);
    }

    // Валидация permissions по ключам
    const permissions = await this.prisma.permission.findMany({ where: { key: { in: dto.permissions } } });
    if (permissions.length !== dto.permissions.length) {
      const foundKeys = permissions.map(p => p.key);
      const missingKeys = dto.permissions.filter(k => !foundKeys.includes(k));
      throw new BadRequestException(`Не найдены permissions: ${missingKeys.join(', ')}`);
    }

    // Чистим старые ресурсные права админа по Location
    await this.prisma.adminResourcePermission.deleteMany({
      where: { adminId: dto.adminId, resourceType: 'Location' }
    });

    // Создаём новые права: декартово произведение locationIds x permissions
    const permissionByKey = new Map(permissions.map(p => [p.key, p] as const));
    const creates = [] as any[];
    for (const locationId of dto.locationIds) {
      for (const key of dto.permissions) {
        const perm = permissionByKey.get(key);
        if (!perm) continue;
        creates.push(this.prisma.adminResourcePermission.create({
          data: {
            adminId: dto.adminId,
            resourceId: locationId,
            resourceType: 'Location',
          }
        }));
      }
    }
    await this.prisma.$transaction(creates);

    return { success: true, adminId: dto.adminId, locations: dto.locationIds.length, permissionsPerLocation: dto.permissions.length };
  }

  /**
   * Возвращает список доступных локаций для админа
   */
  async getAccessibleLocationIdsForAdmin(adminId: string): Promise<string[]> {
    // Если админ является SUPERADMIN — возвращаем все локации
    const adminWithUser = await this.prisma.admin.findUnique({
      where: { id: adminId },
      include: { user: true },
    });
    if (!adminWithUser) return [];
    if (adminWithUser.user.role === 'SUPERADMIN') {
      const all = await this.prisma.location.findMany({ select: { id: true } });
      return all.map(l => l.id);
    }

    const perms = await this.prisma.adminResourcePermission.findMany({
      where: { adminId, resourceType: 'Location' },
      select: { resourceId: true },
    });
    const ids = Array.from(new Set(perms.map(p => p.resourceId)));
    return ids;
  }

  /**
   * Возвращает доступные локации (объекты) для текущего пользователя-админа
   */
  async getAccessibleLocationsForUser(userId: string) {
    // SUPERADMIN видит все локации
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { data: [] };
    if (user.role === 'SUPERADMIN') {
      const locations = await this.prisma.location.findMany({ include: { city: true }, orderBy: { name: 'asc' } });
      return { data: locations };
    }

    const admin = await this.prisma.admin.findUnique({ where: { userId } });
    if (!admin) return { data: [] };
    const ids = await this.getAccessibleLocationIdsForAdmin(admin.id);
    if (ids.length === 0) return { data: [] };
    const locations = await this.prisma.location.findMany({
      where: { id: { in: ids } },
      include: { city: true },
      orderBy: { name: 'asc' }
    });
    return { data: locations };
  }

  /**
   * Возвращает срез площадки по локации, доступной текущему пользователю-админу
   */
  async getLocationSnapshotForUser(userId: string, locationId: string) {
    // SUPERADMIN — доступ к любой локации
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    if (user.role !== 'SUPERADMIN') {
      const admin = await this.prisma.admin.findUnique({ where: { userId } });
      if (!admin) throw new NotFoundException('Администратор не найден');
      const ids = await this.getAccessibleLocationIdsForAdmin(admin.id);
      if (!ids.includes(locationId)) {
        throw new NotFoundException('Локация недоступна');
      }
    }

    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
      include: {
        city: true,
        containers: {
          include: {
            cells: {
              include: {
                size: true,
                status: true,
                rentals: {
                  select: { id: true, endDate: true, status: true, client: { select: { name: true, user: { select: { email: true } } } } }
                }
              }
            }
          }
        }
      }
    });
    if (!location) throw new NotFoundException('Локация не найдена');
    // Агрегация среза по локации
    const allCells = location.containers.flatMap(c => c.cells);
    const now = new Date();

    const cellsTotal = allCells.length;
    const cellsWithActiveRental = allCells.filter(cell => (cell.rentals?.length || 0) > 0);
    const cellsOccupied = cellsWithActiveRental.length;
    const cellsExpired = cellsWithActiveRental.filter(cell => {
      const end = cell.rentals?.[0]?.endDate ? new Date(cell.rentals[0].endDate) : null;
      return !!end && end < now;
    }).length;
    const cellsFree = cellsTotal - cellsOccupied;

    // Разбивка по размерам
    const sizesMap = new Map<string, number>();
    for (const cell of allCells) {
      const label = cell.size?.short_name || cell.size?.name || cell.size?.size || '—';
      sizesMap.set(label, (sizesMap.get(label) || 0) + 1);
    }
    const sizesBreakdown = Array.from(sizesMap.entries()).map(([sizeLabel, count]) => ({ sizeLabel, count }));

    // Плоский список ячеек
    const cells = allCells.map(cell => ({
      id: cell.id,
      number: (cell as any).number || cell.name,
      statusLabel: cell.status?.name || undefined,
      rentalEnd: cell.rentals?.[0]?.endDate || null,
      clientName: cell.rentals?.[0]?.client?.name || undefined,
    }));

    // Недавние платежи по активным арендам локации
    const activeRentalIds = cellsWithActiveRental.map(c => c.rentals[0].id);
    let recentPayments: any[] = [];
    if (activeRentalIds.length > 0) {
      const payments = await this.prisma.payment.findMany({
        where: {
          cellRentalId: { in: activeRentalIds },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          cellRental: {
            select: {
              client: { select: { name: true, user: { select: { email: true } } } },
            }
          }
        }
      });
      recentPayments = payments.map(p => ({
        id: p.id,
        amount: p.amount,
        createdAt: p.createdAt,
        clientName: p.cellRental?.client?.name,
        clientEmail: p.cellRental?.client?.user?.email,
      }));
    }

    const snapshot = {
      location: { id: location.id, name: location.name, short_name: location.short_name, city: location.city },
      cellsTotal,
      cellsOccupied,
      cellsFree,
      cellsExpired,
      sizesBreakdown,
      cells,
      recentPayments,
    } as const;

    return { data: snapshot };
  }
}
