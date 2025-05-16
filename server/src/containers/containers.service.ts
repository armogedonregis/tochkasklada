import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Containers } from '@prisma/client';
import { 
  ContainerSortField, 
  CreateContainerDto, 
  FindContainersDto, 
  SortDirection, 
  UpdateContainerDto 
} from './dto';

/**
 * Сервис для управления контейнерами
 * Используется только для административных целей
 */
@Injectable()
export class ContainersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Поиск контейнеров с пагинацией и фильтрацией
   */
  async findContainers(queryParams: FindContainersDto) {
    const { 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = ContainerSortField.NAME, 
      sortDirection = SortDirection.ASC 
    } = queryParams;

    // Базовые условия фильтрации
    let where: any = {};

    // Если указана поисковая строка, строим сложное условие для поиска
    if (search) {
      // Проверяем, является ли поисковая строка числом
      const numberSearch = !isNaN(Number(search)) ? Number(search) : null;
      
      where = {
        OR: [
          // Поиск по номеру контейнера, если search - число
          ...(numberSearch !== null ? [{ name: numberSearch }] : []),
          
          // Поиск по локации (через связь)
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
      };
    }

    // Вычисляем параметры пагинации
    const skip = (page - 1) * limit;

    // Настройка сортировки
    let orderBy: any = {};
    
    // В зависимости от выбранного поля сортировки
    switch (sortBy) {
      case ContainerSortField.NAME:
        orderBy.name = sortDirection;
        break;
      case ContainerSortField.LOCATION:
        orderBy.location = { name: sortDirection };
        break;
      case ContainerSortField.CREATED_AT:
      default:
        orderBy.createdAt = sortDirection;
        break;
    }

    // Запрос на получение общего количества
    const totalCount = await this.prisma.containers.count({ where });

    // Запрос на получение данных с пагинацией
    const containers = await this.prisma.containers.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        location: {
          include: {
            city: true
          }
        },
      },
    });

    // Рассчитываем количество страниц
    const totalPages = Math.ceil(totalCount / limit);

    // Возвращаем результат с мета-информацией
    return {
      data: containers,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Получение контейнера по ID с его ячейками
   */
  async findOne(id: string): Promise<Containers> {
    const container = await this.prisma.containers.findUnique({
      where: { id },
      include: {
        location: true,
        cells: true
      }
    });

    if (!container) {
      throw new NotFoundException(`Контейнер с ID ${id} не найден`);
    }

    return container;
  }

  /**
   * Создание нового контейнера
   */
  async create(createContainerDto: CreateContainerDto): Promise<any> {
    try {
      // Извлекаем массив ячеек из запроса
      const { cells, ...containerData } = createContainerDto;
      
      // Используем транзакцию для атомарного создания контейнера и ячеек
      return await this.prisma.$transaction(async (tx) => {
        // Создаем новый контейнер
        const container = await tx.containers.create({
          data: containerData,
          include: {
            location: {
              include: {
                city: true
              }
            }
          }
        });
        
        // Если есть ячейки для создания
        if (cells && cells.length > 0) {
          // Создаем каждую ячейку и связываем с контейнером
          for (const cell of cells) {
            await tx.cells.create({
              data: {
                name: cell.name,
                size_id: cell.size_id,
                containerId: container.id
              }
            });
          }
          
          // Возвращаем контейнер со всеми созданными ячейками
          const containerWithCells = await tx.containers.findUnique({
            where: { id: container.id },
            include: {
              location: {
                include: {
                  city: true
                }
              },
              cells: {
                include: {
                  size: true,
                  status: true
                }
              }
            }
          });
          
          if (!containerWithCells) {
            throw new Error(`Не удалось найти созданный контейнер с ID ${container.id}`);
          }
          
          return containerWithCells;
        }
        
        // Если ячеек нет, возвращаем просто контейнер
        return container;
      });
    } catch (error) {
      // Проверяем ошибку дублирования номера
      if (error.code === 'P2002') {
        throw new ConflictException(`Контейнер с номером ${createContainerDto.name} уже существует`);
      }
      throw error;
    }
  }

  /**
   * Обновление контейнера
   */
  async update(id: string, updateContainerDto: UpdateContainerDto): Promise<any> {
    try {
      // Извлекаем параметры для ячеек
      const { cells, ...containerData } = updateContainerDto;
      
      return await this.prisma.$transaction(async (tx) => {
        // Обновляем данные контейнера
        const container = await tx.containers.update({
          where: { id },
          data: containerData,
          include: {
            location: {
              include: {
                city: true
              }
            },
            cells: true // Получаем текущие ячейки для анализа
          }
        });
        
        // Если переданы данные о ячейках
        if (cells !== undefined) {
          // Получаем текущие ячейки
          const existingCells = container.cells || [];
          
          // Создаем карту имён существующих ячеек
          const existingCellsByName = new Map();
          existingCells.forEach(cell => {
            existingCellsByName.set(cell.name, cell);
          });
          
          // Создаем карту имён новых ячеек
          const newCellsByName = new Map();
          cells.forEach(cell => {
            newCellsByName.set(cell.name, cell);
          });
          
          // Определяем ячейки для удаления (есть в существующих, но нет в новых)
          const cellsToDelete = existingCells.filter(
            existingCell => !newCellsByName.has(existingCell.name)
          );
          
          // Удаляем неиспользуемые ячейки
          for (const cellToDelete of cellsToDelete) {
            await tx.cells.delete({
              where: { id: cellToDelete.id }
            });
          }
          
          // Обрабатываем новые и обновляемые ячейки
          for (const newCell of cells) {
            const existingCell = existingCellsByName.get(newCell.name);
            
            if (existingCell) {
              // Обновляем существующую ячейку, если изменился размер
              if (existingCell.size_id !== newCell.size_id) {
                await tx.cells.update({
                  where: { id: existingCell.id },
                  data: { size_id: newCell.size_id }
                });
              }
            } else {
              // Создаем новую ячейку
              await tx.cells.create({
                data: {
                  name: newCell.name,
                  size_id: newCell.size_id,
                  containerId: id
                }
              });
            }
          }
        }
        
        // Возвращаем обновленный контейнер со всеми ячейками
        const updatedContainer = await tx.containers.findUnique({
          where: { id },
          include: {
            location: {
              include: {
                city: true
              }
            },
            cells: {
              include: {
                size: true,
                status: true
              }
            }
          }
        });
        
        if (!updatedContainer) {
          throw new Error(`Не удалось найти обновленный контейнер с ID ${id}`);
        }
        
        return updatedContainer;
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Контейнер с номером ${updateContainerDto.name} уже существует`);
      }
      throw new NotFoundException(`Контейнер с ID ${id} не найден или произошла ошибка при обновлении`);
    }
  }

  /**
   * Удаление контейнера
   * @returns Объект с ID удаленного контейнера для оптимистического обновления в RTK Query
   */
  async remove(id: string): Promise<{ id: string }> {
    try {
      await this.prisma.containers.delete({
        where: { id },
      });
      
      // Возвращаем ID для RTK Query оптимистического обновления
      return { id };
    } catch (error) {
      throw new NotFoundException(`Контейнер с ID ${id} не найден`);
    }
  }
} 