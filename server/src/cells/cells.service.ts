import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellDto, UpdateCellDto, FindCellsDto, CellSortField, SortDirection } from './dto';

@Injectable()
export class CellsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Расширенный поиск ячеек с пагинацией, сортировкой и фильтрацией
   */
  async findCells(queryParams: FindCellsDto) {
    const {
      search,
      containerId,
      locationId,
      sizeId,
      available,
      page = 1,
      limit = 10,
      sortBy = CellSortField.NAME,
      sortDirection = SortDirection.ASC
    } = queryParams;

    // Базовые условия фильтрации
    let where: any = {};

    // Фильтр по контейнеру
    if (containerId) {
      where.containerId = containerId;
    }

    // Фильтр по размеру
    if (sizeId) {
      where.size_id = sizeId;
    }

    // Если указана поисковая строка, строим сложное условие для поиска
    if (search) {
      // Проверяем, является ли поисковая строка буквой ячейки
      where.OR = [
        // Поиск по имени ячейки
        { name: { contains: search, mode: 'insensitive' } },
        // Поиск по комментарию
        { comment: { contains: search, mode: 'insensitive' } },
        // Поиск по размеру через связь
        {
          size: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { short_name: { contains: search, mode: 'insensitive' } }
            ]
          }
        },
        // Поиск по контейнеру и локации
        {
          container: {
            OR: [
              // Поиск по имени контейнера
              { name: { equals: isNaN(Number(search)) ? undefined : Number(search) } },
              // Поиск по локации
              {
                location: {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { short_name: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } },
                    // Поиск по городу через вложенную связь
                    {
                      city: {
                        OR: [
                          { title: { contains: search, mode: 'insensitive' } },
                          { short_name: { contains: search, mode: 'insensitive' } }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ];
    }

    // Фильтр по локации
    if (locationId) {
      where.container = {
        ...where.container,
        location: {
          ...where.container?.location,
          id: locationId
        }
      };
    }

    // Фильтр по доступности (только свободные ячейки)
    if (available) {
      where.NOT = {
        rentals: {
          some: {
            isActive: true
          }
        }
      };
    }

    // Вычисляем параметры пагинации
    const skip = (page - 1) * limit;

    // Настройка сортировки
    let orderBy: any = {};
    
    // В зависимости от выбранного поля сортировки
    switch (sortBy) {
      case CellSortField.NAME:
        orderBy.name = sortDirection;
        break;
      case CellSortField.SIZE:
        orderBy.size = { name: sortDirection };
        break;
      case CellSortField.LOCATION:
        orderBy.container = { location: { name: sortDirection } };
        break;
      case CellSortField.CITY:
        orderBy.container = { location: { city: { title: sortDirection } } };
        break;
      case CellSortField.CREATED_AT:
      default:
        orderBy.createdAt = sortDirection;
        break;
    }

    // Запрос на получение общего количества
    const totalCount = await this.prisma.cells.count({ where });

    // Запрос на получение данных с пагинацией
    const cells = await this.prisma.cells.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        container: {
          include: {
            location: {
              include: {
                city: true
              }
            }
          }
        },
        size: true,
        status: true,
        rentals: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            rentalStatus: true
          },
          take: 1 // Берем только активную аренду, если есть
        }
      },
    });

    // Рассчитываем количество страниц
    const totalPages = Math.ceil(totalCount / limit);

    // Возвращаем результат с мета-информацией
    return {
      data: cells,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Получение ячейки по ID
   */
  async findOne(id: string) {
    const cell = await this.prisma.cells.findUnique({
      where: { id },
      include: {
        container: {
          include: {
            location: {
              include: {
                city: true
              }
            }
          }
        },
        size: true,
        status: true
      }
    });
    
    if (!cell) {
      throw new NotFoundException(`Ячейка с ID ${id} не найдена`);
    }
    
    return cell;
  }

  /**
   * Создание новой ячейки
   */
  async create(createCellDto: CreateCellDto) {
    try {
      return await this.prisma.cells.create({
        data: createCellDto,
        include: {
          container: true,
          size: true,
          status: true
        }
      });
    } catch (error) {
      throw new Error(`Ошибка при создании ячейки: ${error.message}`);
    }
  }

  /**
   * Обновление ячейки
   */
  async update(id: string, updateCellDto: UpdateCellDto) {
    try {
      const cell = await this.prisma.cells.update({
        where: { id },
        data: updateCellDto,
        include: {
          container: true,
          size: true,
          status: true
        }
      });
      
      return cell;
    } catch (error) {
      throw new NotFoundException(`Ячейка с ID ${id} не найдена или произошла ошибка при обновлении`);
    }
  }

  /**
   * Удаление ячейки
   */
  async remove(id: string) {
    try {
      await this.prisma.cells.delete({
        where: { id },
      });
      
      // Возвращаем ID для оптимистических обновлений на клиенте
      return { id };
    } catch (error) {
      throw new NotFoundException(`Ячейка с ID ${id} не найдена`);
    }
  }
}