import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CreateListDto, FindListsDto, CloseListDto, ListSortField, SortDirection } from './dto';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { RolesService } from '@/apps/roles/roles.service';

@Injectable()
export class ListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly rolesService: RolesService,
  ) {
    this.logger.debug?.('ListService instantiated', ListService.name);
  }

  // Создание записи листа ожидания
  async createList(data: CreateListDto) {
    this.logger.log(`Creating list entry for ${data.email}`, ListService.name);

    try {
      const list = await this.prisma.list.create({
        data: {
          email: data.email,
          phone: data.phone,
          name: data.name,
          description: data.description,
          locationId: data.locationId,
          sizeId: data.sizeId,
        }
      });

      this.logger.log(`List entry created with ID: ${list.id}`, ListService.name);
      return list;
    } catch (error) {
      this.logger.error(`Failed to create list entry: ${error.message}`, error.stack, ListService.name);
      throw new InternalServerErrorException('Ошибка при создании заявки');
    }
  }

  // Получение записи по ID
  async getListById(id: string) {
    const list = await this.prisma.list.findUnique({
      where: { id },
      include: {
        closedBy: {
          include: {
            user: {
              select: { id: true, email: true }
            }
          }
        },
        location: {
          select: { id: true, name: true, short_name: true }
        },
        size: {
          select: { id: true, name: true, short_name: true }
        }
      }
    });

    if (!list) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    return list;
  }

  // Получение всех записей с фильтрацией и пагинацией
  async getAllLists(queryParams: FindListsDto, currentUser?: { id: string; role: string }) {
    try {
      const {
        search,
        locationId,
        sizeId,
        status,
        page = 1,
        limit = 10,
        sortBy = ListSortField.CREATED_AT,
        sortDirection = SortDirection.DESC,
      } = queryParams;

      // Базовые условия фильтрации
      let where: any = {};

      if (status) {
        where.status = status;
      }

      // Фильтр по локации
      if (locationId) {
        where.locationId = locationId;
      }
      if (sizeId) {
        where.sizeId = sizeId;
      }

      // Поисковая строка
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Фильтрация по доступным локациям для ADMIN
      if (currentUser && currentUser.role === 'ADMIN') {
        const admin = await this.prisma.admin.findUnique({ where: { userId: currentUser.id }, select: { id: true } });
        if (admin) {
          const accessibleLocationIds = await this.rolesService.getAccessibleLocationIdsForAdmin(admin.id);
          if (accessibleLocationIds.length === 0) {
            return { data: [], meta: { totalCount: 0, page, limit, totalPages: 0 } } as any;
          }
          
          // Ограничиваем выдачу листов ожидания только доступными локациями
          if (where.OR) {
            // Если уже есть OR условия (поиск), добавляем дополнительное условие через AND
            where = {
              AND: [
                where,
                { locationId: { in: accessibleLocationIds } }
              ]
            };
          } else {
            // Если нет поисковых условий, просто ограничиваем по locationId
            where.locationId = where.locationId ? 
              { in: accessibleLocationIds.filter(id => id === where.locationId) } : 
              { in: accessibleLocationIds };
          }
        }
      }

      // Вычисляем параметры пагинации
      const skip = (page - 1) * limit;

      // Настройка сортировки
      let orderBy: any = {};

      switch (sortBy) {
        case ListSortField.NAME:
          orderBy.name = sortDirection;
          break;
        case ListSortField.EMAIL:
          orderBy.email = sortDirection;
          break;
        case ListSortField.CREATED_AT:
        default:
          orderBy.createdAt = sortDirection;
          break;
      }

      // Запрос на получение общего количества
      const totalCount = await this.prisma.list.count({ where });

      // Запрос на получение данных с пагинацией
      const lists = await this.prisma.list.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          closedBy: {
            include: {
              user: {
                select: { id: true, email: true }
              }
            }
          },
          location: {
            select: { id: true, name: true, short_name: true }
          },
          size: {
            select: { id: true, name: true, short_name: true }
          }
        }
      });

      // Рассчитываем количество страниц
      const totalPages = Math.ceil(totalCount / limit);

      this.logger.log(`Found ${lists.length} lists (total: ${totalCount}) with filters: ${JSON.stringify(where)}`, ListService.name);

      return {
        data: lists,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при получении списка заявок: ${error.message}`);
    }
  }

  // Закрытие записи (без статуса)
  async closeList(id: string, userId: string, data: CloseListDto) {
    this.logger.log(`Closing list ${id} by user ${userId}`, ListService.name);

    // Находим админа по userId
    const admin = await this.prisma.admin.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!admin) {
      throw new BadRequestException('Админ не найден');
    }

    // Проверяем, существует ли заявка
    const existingList = await this.getListById(id);

    try {
      const updatedList = await this.prisma.list.update({
        where: { id },
        data: {
          comment: data.comment,
          closedById: admin.id, // Используем ID админа из таблицы admins
          closedAt: new Date(),
          status: "CLOSED"
        },
        include: {
          closedBy: {
            include: {
              user: {
                select: { id: true, email: true }
              }
            }
          }
        }
      });

      this.logger.log(`List ${id} closed successfully by admin ${admin.id}`, ListService.name);
      return updatedList;
    } catch (error) {
      this.logger.error(`Failed to close list: ${error.message}`, error.stack, ListService.name);
      throw new InternalServerErrorException('Ошибка при закрытии заявки');
    }
  }

  // Получение статистики по заявкам
  async getListStats() {
    try {
      const [waitingCount] = await Promise.all([
        this.prisma.list.count()
      ]);

      return {
        waiting: waitingCount,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при получении статистики: ${error.message}`);
    }
  }

  // Удаление заявки (только для админов)
  async deleteList(id: string) {
    this.logger.log(`Deleting list ${id}`, ListService.name);

    // Проверяем, существует ли заявка
    await this.getListById(id);

    try {
      await this.prisma.list.delete({
        where: { id }
      });

      this.logger.log(`List ${id} deleted successfully`, ListService.name);
      return { success: true, message: `Заявка ${id} успешно удалена` };
    } catch (error) {
      this.logger.error(`Failed to delete list: ${error.message}`, error.stack, ListService.name);
      throw new InternalServerErrorException('Ошибка при удалении заявки');
    }
  }
} 