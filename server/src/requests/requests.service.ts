import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';
import { CreateRequestDto, FindRequestsDto, CloseRequestDto, RequestSortField, SortDirection } from './dto';
import { ListService } from '../list/list.service';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly listService: ListService,
  ) {
    this.logger.debug?.('RequestsService instantiated', RequestsService.name);
  }

  /**
   * Создание новой заявки
   */
  async createRequest(data: CreateRequestDto) {
    this.logger.log(`Creating request for ${data.email}`, RequestsService.name);

    try {
      const request = await this.prisma.request.create({
        data: {
          email: data.email,
          phone: data.phone,
          name: data.name,
          description: data.description,
          status: 'WAITING'
        }
      });

      this.logger.log(`Request created with ID: ${request.id}`, RequestsService.name);
      return request;
    } catch (error) {
      this.logger.error(`Failed to create request: ${error.message}`, error.stack, RequestsService.name);
      throw new BadRequestException('Ошибка при создании заявки');
    }
  }

  /**
   * Получение всех заявок с фильтрацией и пагинацией
   */
  async getAllRequests(queryParams: FindRequestsDto) {
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = RequestSortField.CREATED_AT,
        sortDirection = SortDirection.DESC,
        status
      } = queryParams;

      // Базовые условия фильтрации
      let where: any = {};

      // Фильтр по статусу
      if (status) {
        where.status = status;
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

      // Вычисляем параметры пагинации
      const skip = (page - 1) * limit;

      // Настройка сортировки
      let orderBy: any = {};

      switch (sortBy) {
        case RequestSortField.NAME:
          orderBy.name = sortDirection;
          break;
        case RequestSortField.EMAIL:
          orderBy.email = sortDirection;
          break;
        case RequestSortField.STATUS:
          orderBy.status = sortDirection;
          break;
        case RequestSortField.CREATED_AT:
        default:
          orderBy.createdAt = sortDirection;
          break;
      }

      // Выполняем запрос
      const [requests, totalCount] = await Promise.all([
        this.prisma.request.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            closedBy: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true
                  }
                }
              }
            }
          }
        }),
        this.prisma.request.count({ where })
      ]);

      return {
        data: requests,
        meta: {
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get requests: ${error.message}`, error.stack, RequestsService.name);
      throw new BadRequestException('Ошибка при получении заявок');
    }
  }

  /**
   * Получение заявки по ID
   */
  async getRequestById(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        closedBy: {
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    return request;
  }

  /**
   * Закрытие заявки
   */
  async closeRequest(id: string, userId: string, data: CloseRequestDto) {
    this.logger.log(`Closing request ${id} by user ${userId}`, RequestsService.name);

    // Находим админа по userId
    const admin = await this.prisma.admin.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!admin) {
      throw new BadRequestException('Админ не найден');
    }

    const request = await this.prisma.request.findUnique({
      where: { id }
    });

    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    if (request.status === 'CLOSED') {
      throw new BadRequestException('Заявка уже закрыта');
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedById: admin.id, // Используем ID админа из таблицы admins
        closedAt: new Date(),
        comment: data.comment || 'Закрыто администратором'
      },
      include: {
        closedBy: {
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      }
    });

    this.logger.log(`Request ${id} successfully closed by admin ${admin.id}`, RequestsService.name);
    return updatedRequest;
  }

  /**
   * Получение статистики по заявкам
   */
  async getRequestsStats() {
    try {
      const stats = await this.prisma.request.groupBy({
        by: ['status'],
        _count: { status: true }
      });

      const result = stats.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: Object.values(result).reduce((sum, count) => sum + count, 0),
        byStatus: result
      };
    } catch (error) {
      this.logger.error(`Failed to get request stats: ${error.message}`, error.stack, RequestsService.name);
      throw new BadRequestException('Ошибка при получении статистики');
    }
  }

  /**
   * Удаление заявки (только для суперадминов)
   */
  async deleteRequest(id: string) {
    this.logger.log(`Deleting request ${id}`, RequestsService.name);

    const request = await this.prisma.request.findUnique({
      where: { id }
    });

    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    await this.prisma.request.delete({
      where: { id }
    });

    this.logger.log(`Request ${id} successfully deleted`, RequestsService.name);
    return { success: true, message: 'Заявка успешно удалена' };
  }

  /**
   * Перенос заявки в лист ожидания и закрытие заявки
   */
  async moveRequestToList(id: string, userId: string, data?: CloseRequestDto) {
    this.logger.log(`Moving request ${id} to waiting list by user ${userId}`, RequestsService.name);

    // Находим админа по userId
    const admin = await this.prisma.admin.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!admin) {
      throw new BadRequestException('Админ не найден');
    }

    const request = await this.prisma.request.findUnique({ where: { id } });
    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }
    if (request.status === 'CLOSED') {
      throw new BadRequestException('Заявка уже закрыта');
    }

    // Создаем запись в листе ожидания без source
    const listEntry = await this.listService.createList({
      email: request.email,
      phone: request.phone || undefined,
      name: request.name,
      description: request.description || undefined,
      locationId: data?.locationId || undefined, // Передаем locationId если есть
    });

    // Закрываем оригинальную заявку
    const closedRequest = await this.prisma.request.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedById: admin.id, // Используем ID админа из таблицы admins
        closedAt: new Date(),
        comment: data?.comment || 'Перенесено в лист ожидания',
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

    this.logger.log(`Request ${id} moved to list (List ID: ${listEntry.id}) and closed by admin ${admin.id}`, RequestsService.name);
    return { listEntry, request: closedRequest };
  }
} 