import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Containers } from '@prisma/client';
import { 
  ContainerSortField, 
  CreateContainerDto, 
  FindContainersDto, 
  SortDirection, 
  UpdateContainerDto 
} from './dto';
import { LoggerService } from '../logger/logger.service';
import { RolesService } from '../roles/roles.service';

/**
 * Сервис для управления контейнерами
 * Используется только для административных целей
 */
@Injectable()
export class ContainersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly rolesService: RolesService,
  ) {
    this.logger.log('ContainersService instantiated', 'ContainersService');
  }

  /**
   * Поиск контейнеров с пагинацией и фильтрацией
   */
  async findContainers(queryParams: FindContainersDto, currentUser?: { id: string; role: string }) {
    this.logger.log(`Finding containers with query: ${JSON.stringify(queryParams)}`, 'ContainersService');
    try {
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

      // Фильтрация по доступным локациям для ADMIN
      if (currentUser && currentUser.role === 'ADMIN') {
        const admin = await this.prisma.admin.findUnique({ where: { userId: currentUser.id }, select: { id: true } });
        if (admin) {
          const accessibleLocationIds = await this.rolesService.getAccessibleLocationIdsForAdmin(admin.id);
          if (accessibleLocationIds.length === 0) {
            return { data: [], meta: { totalCount: 0, page, limit, totalPages: 0 } } as any;
          }
          
          // Ограничиваем выдачу контейнеров только доступными локациями
          if (where.OR) {
            // Если уже есть OR условия (поиск), добавляем дополнительное условие через AND
            where = {
              AND: [
                where,
                { locId: { in: accessibleLocationIds } }
              ]
            };
          } else {
            // Если нет поисковых условий, просто ограничиваем по locId
            where.locId = { in: accessibleLocationIds };
          }
        }
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
    } catch (error) {
      this.logger.error(`Failed to find containers: ${error.message}`, error.stack, 'ContainersService');
      throw new InternalServerErrorException('Ошибка при поиске контейнеров');
    }
  }

  /**
   * Получение контейнера по ID с его ячейками
   */
  async findOne(id: string): Promise<Containers> {
    this.logger.log(`Fetching container with id: ${id}`, 'ContainersService');
    const container = await this.prisma.containers.findUnique({
      where: { id },
      include: {
        location: true,
        cells: {
          include: {
            size: true
          }
        }
      }
    });

    if (!container) {
      this.logger.warn(`Container with id ${id} not found`, 'ContainersService');
      throw new NotFoundException(`Контейнер с ID ${id} не найден`);
    }

    return container;
  }

  /**
   * Создание нового контейнера
   */
  async create(createContainerDto: CreateContainerDto): Promise<any> {
    this.logger.log(`Creating new container with name: ${createContainerDto.name}`, 'ContainersService');
    try {
      // Извлекаем массив ячеек из запроса
      const { cells, ...containerData } = createContainerDto;
      
      // Используем транзакцию для атомарного создания контейнера и ячеек
      const newContainer = await this.prisma.$transaction(async (tx) => {
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
          this.logger.log(`Creating ${cells.length} cells for container ${container.id}`, 'ContainersService');
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
            this.logger.error(`Could not find the newly created container with id ${container.id} after cell creation`, '', 'ContainersService');
            throw new Error(`Не удалось найти созданный контейнер с ID ${container.id}`);
          }
          
          return containerWithCells;
        }
        
        // Если ячеек нет, возвращаем просто контейнер
        return container;
      });

      this.logger.log(`Container created successfully with id: ${newContainer.id}`, 'ContainersService');
      return newContainer;
    } catch (error) {
      this.logger.error(`Failed to create container: ${error.message}`, error.stack, 'ContainersService');
      // Проверяем ошибку дублирования номера
      if (error.code === 'P2002') {
        throw new ConflictException(`Контейнер с номером ${createContainerDto.name} уже существует`);
      }
      throw new InternalServerErrorException('Ошибка при создании контейнера');
    }
  }

  /**
   * Обновление контейнера
   */
  async update(id: string, updateContainerDto: UpdateContainerDto): Promise<any> {
    this.logger.log(`Updating container with id: ${id}`, 'ContainersService');
    try {
      // Извлекаем параметры для ячеек
      const { cells, ...containerData } = updateContainerDto;
      
      const updatedContainer = await this.prisma.$transaction(async (tx) => {
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
          this.logger.log(`Updating cells for container id: ${id}`, 'ContainersService');
          // Получаем текущие ячейки
          const existingCells = container.cells || [];
          
          // Создаем карту имён существующих ячеек
          const existingCellsByName = new Map();
          existingCells.forEach(cell => {
            existingCellsByName.set(cell.name, cell);
          });
          
          // Создаем карту имён новых ячеек
          const newCellsData = new Map();
          cells.forEach(cell => {
            newCellsData.set(cell.name, cell);
          });
          
          // Определяем ячейки для удаления, обновления и создания
          const cellsToDelete = existingCells.filter(cell => !newCellsData.has(cell.name));
          const cellsToUpdate = cells.filter(cell => existingCellsByName.has(cell.name));
          const cellsToCreate = cells.filter(cell => !existingCellsByName.has(cell.name));
          
          // Удаляем ячейки
          if (cellsToDelete.length > 0) {
            this.logger.log(`Deleting ${cellsToDelete.length} cells from container ${id}`, 'ContainersService');
            await tx.cells.deleteMany({
              where: {
                id: { in: cellsToDelete.map(c => c.id) }
              }
            });
          }
          
          // Обновляем ячейки
          if (cellsToUpdate.length > 0) {
            this.logger.log(`Updating ${cellsToUpdate.length} cells in container ${id}`, 'ContainersService');
            for (const cellData of cellsToUpdate) {
              const existingCell = existingCellsByName.get(cellData.name);
              await tx.cells.update({
                where: { id: existingCell.id },
                data: {
                  name: cellData.name,
                  size_id: cellData.size_id
                }
              });
            }
          }
          
          // Создаем новые ячейки
          if (cellsToCreate.length > 0) {
            this.logger.log(`Creating ${cellsToCreate.length} new cells in container ${id}`, 'ContainersService');
            for (const cellData of cellsToCreate) {
              await tx.cells.create({
                data: {
                  name: cellData.name,
                  size_id: cellData.size_id,
                  containerId: id
                }
              });
            }
          }
        }
        
        // Возвращаем обновленный контейнер с актуальным списком ячеек
        return tx.containers.findUnique({
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
      });

      this.logger.log(`Container with id ${id} updated successfully`, 'ContainersService');
      return updatedContainer;
    } catch (error) {
      this.logger.error(`Failed to update container with id ${id}: ${error.message}`, error.stack, 'ContainersService');
      // Проверяем ошибку дублирования номера
      if (error.code === 'P2002') {
        throw new ConflictException(`Контейнер с таким номером уже существует`);
      }
      throw new InternalServerErrorException('Ошибка при обновлении контейнера');
    }
  }

  /**
   * Удаление контейнера
   * @returns Объект с ID удаленного контейнера для оптимистического обновления в RTK Query
   */
  async remove(id: string): Promise<{ id: string }> {
    this.logger.log(`Removing container with id: ${id}`, 'ContainersService');
    try {
      await this.findOne(id); // Проверка существования
      
      // Используем транзакцию для удаления контейнера и его ячеек
      await this.prisma.$transaction(async (tx) => {
        // Сначала удаляем все ячейки в контейнере
        await tx.cells.deleteMany({
          where: { containerId: id },
        });
        
        // Затем удаляем сам контейнер
        await tx.containers.delete({
          where: { id },
        });
      });

      this.logger.log(`Container with id ${id} removed successfully`, 'ContainersService');
      return { id };
    } catch (error) {
      this.logger.error(`Failed to remove container with id ${id}: ${error.message}`, error.stack, 'ContainersService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при удалении контейнера`);
    }
  }
} 