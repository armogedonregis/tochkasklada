import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellRentalDto, UpdateCellRentalDto, ExtendCellRentalDto, FindCellRentalsDto, CellRentalSortField, SortDirection, UpdateRentalStatusDto } from './dto';
import { CellRentalStatus, Prisma } from '@prisma/client';
import { CellFreeSortField, FindFreeCellRentalsDto } from './dto/find-free-cells.dto';
import { LoggerService } from '../logger/logger.service';
import { FindGanttRentalsDto } from './dto/find-gantt-rentals.dto';

@Injectable()
export class CellRentalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('CellRentalsService instantiated', 'CellRentalsService');
  }

  // Получение аренд с фильтрацией, поиском и пагинацией
  async findCellRentals(queryParams: FindCellRentalsDto) {
    this.logger.log(`Fetching cell rentals with query: ${JSON.stringify(queryParams)}`, 'CellRentalsService');
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = CellRentalSortField.CREATED_AT,
        sortDirection = SortDirection.DESC,
        onlyActive,
        rentalStatus,
        cellId,
        cellIds,
        clientId,
        statusId,
        locationId
      } = queryParams;

      // Базовые условия фильтрации
      let where: Prisma.CellRentalWhereInput = {};

      // Фильтр по активности
      if (onlyActive !== undefined) {
        where.isActive = onlyActive;
      }

      // Фильтр по статусу аренды
      if (rentalStatus) {
        where.rentalStatus = rentalStatus;
      }

      // Фильтр по ID ячейки или массиву ячеек
      if (cellId || cellIds) {
        // Объединяем cellId и cellIds в один массив
        const allCellIds: string[] = [];
        if (cellId) allCellIds.push(cellId);
        if (cellIds) allCellIds.push(...cellIds);

        where.cell = {
          some: {
            id: {
              in: allCellIds
            }
          }
        };
      }

      // Фильтр по ID клиента
      if (clientId) {
        where.clientId = clientId;
      }

      // Фильтр по ID статуса ячейки и локации
      if (statusId || locationId) {
        // Если уже есть фильтр по ячейкам, объединяем условия
        if (where.cell) {
          where.cell.some = {
            ...where.cell.some,
            ...(statusId && { statusId }),
            ...(locationId && {
              container: {
                location: {
                  id: locationId
                }
              }
            })
          };
        } else {
          where.cell = {
            some: {
              ...(statusId && { statusId }),
              ...(locationId && {
                container: {
                  location: {
                    id: locationId
                  }
                }
              })
            }
          };
        }
      }

      // Поиск по строке
      if (search) {
        where.OR = [
          // Поиск по имени клиента
          { client: { name: { contains: search, mode: 'insensitive' } } },
          // Поиск по номеру телефона клиента
          { client: { phones: { some: { phone: { contains: search, mode: 'insensitive' } } } } },
          // Поиск по имени ячейки (теперь это массив)
          { cell: { some: { name: { contains: search, mode: 'insensitive' } } } }
        ];
      }

      // Вычисляем параметры пагинации
      const skip = (page - 1) * limit;

      // Настройка сортировки
      let orderBy: Prisma.CellRentalOrderByWithRelationInput = {};

      // В зависимости от выбранного поля сортировки
      switch (sortBy) {
        case CellRentalSortField.START_DATE:
          orderBy.startDate = sortDirection;
          break;
        case CellRentalSortField.END_DATE:
          orderBy.endDate = sortDirection;
          break;
        case CellRentalSortField.RENTAL_STATUS:
          orderBy.rentalStatus = sortDirection;
          break;
        case CellRentalSortField.CREATED_AT:
        default:
          orderBy.createdAt = sortDirection;
          break;
      }

      // Запрос на получение общего количества
      const totalCount = await this.prisma.cellRental.count({ where });

      // Запрос на получение данных с пагинацией
      const rentals = await this.prisma.cellRental.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          cell: {
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
            },
          },
          client: {
            include: {
              phones: true,
              user: {
                select: {
                  email: true,
                }
              }
            }
          },
          status: true,
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true,
            },
          },
        }
      });

      // Рассчитываем количество страниц
      const totalPages = Math.ceil(totalCount / limit);

      // Возвращаем результат с мета-информацией
      return {
        data: rentals,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch cell rentals: ${error.message}`, error.stack, 'CellRentalsService');
      throw new InternalServerErrorException(`Ошибка при получении списка аренд: ${error.message}`);
    }
  }

  // Получение всех свободных ячеек
  async getFreeCells(queryParams: FindFreeCellRentalsDto) {
    this.logger.log(`Fetching free cells with query: ${JSON.stringify(queryParams)}`, 'CellRentalsService');
    try {
      const {
        search,
        locationId,
        sizeId,
        page = 1,
        limit = 10,
        // Для free-cells разумнее дефолт сортировать по локации/имени
        sortBy = CellFreeSortField.LOCATION,
        sortDirection = SortDirection.ASC,
      } = queryParams;

      const where: Prisma.CellsWhereInput = {};

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

      // Фильтр по конкретной локации
      if (locationId) {
        // Корректно формируем AND-условия с учетом типов Prisma
        const andConditions: Prisma.CellsWhereInput[] = Array.isArray((where as any).AND)
          ? ([...(where as any).AND] as Prisma.CellsWhereInput[])
          : ((where as any).AND ? [((where as any).AND as Prisma.CellsWhereInput)] : []);

        andConditions.push({ container: { location: { id: locationId } } });
        (where as any).AND = andConditions;
      }

      // Фильтр по размеру
      if (sizeId) {
        const andConditions: Prisma.CellsWhereInput[] = Array.isArray((where as any).AND)
          ? ([...(where as any).AND] as Prisma.CellsWhereInput[])
          : ((where as any).AND ? [((where as any).AND as Prisma.CellsWhereInput)] : []);

        andConditions.push({ size_id: sizeId });
        (where as any).AND = andConditions;
      }


      // Вычисляем параметры пагинации
      const skip = (page - 1) * limit;

      // Настройка сортировки
      let orderBy: any = {};

      // В зависимости от выбранного поля сортировки
      switch (sortBy) {
        case CellFreeSortField.NAME:
          orderBy.name = sortDirection;
          break;
        case CellFreeSortField.SIZE:
          orderBy.size = { name: sortDirection };
          break;
        case CellFreeSortField.LOCATION:
          orderBy.container = { location: { name: sortDirection } };
          break;
        case CellFreeSortField.CITY:
          orderBy.container = { location: { city: { title: sortDirection } } };
          break;
        default:
          orderBy.container = { location: { name: sortDirection } };
          break;
      }


      // Объединяем существующие AND-условия с условием "ячейка свободна"
      const baseAndConditions: Prisma.CellsWhereInput[] = Array.isArray((where as any).AND)
        ? ([...(where as any).AND] as Prisma.CellsWhereInput[])
        : ((where as any).AND ? [((where as any).AND as Prisma.CellsWhereInput)] : []);

      baseAndConditions.push({
        OR: [
          // Ячейка не имеет аренд
          { rentals: { none: {} } },
          // Все аренды ячейки не активны
          { rentals: { every: { isActive: false } } }
        ]
      });

      const mergedWhere: Prisma.CellsWhereInput = {
        ...where,
        AND: baseAndConditions
      };

      // Запрос на получение общего количества
      const totalCount = await this.prisma.cells.count({
        where: mergedWhere
      });

      // Находим все ячейки, у которых нет активных аренд
      // или с определенным статусом
      const cells = await this.prisma.cells.findMany({
        where: mergedWhere,
        skip,
        take: limit,
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
            where: { isActive: true },
          }
        },
        orderBy,

      });
      // Рассчитываем количество страниц
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: cells,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch free cells: ${error.message}`, error.stack, 'CellRentalsService');
      throw new InternalServerErrorException(`Ошибка при получении списка аренд: ${error.message}`);
    }
  }

  // Создание новой аренды ячейки
  async create(createCellRentalDto: CreateCellRentalDto) {
    // Определяем массив ячеек для аренды
    const cellsToRent: string[] = [];
    if (createCellRentalDto.cellId) {
      cellsToRent.push(createCellRentalDto.cellId);
    }
    if (createCellRentalDto.cellIds) {
      cellsToRent.push(...createCellRentalDto.cellIds);
    }

    if (cellsToRent.length === 0) {
      throw new BadRequestException('Необходимо указать хотя бы одну ячейку для аренды');
    }

    this.logger.log(`Creating new cell rental for cells: ${cellsToRent.join(', ')}`, 'CellRentalsService');
    
    try {
      // Проверяем, существует ли клиент
      const client = await this.prisma.client.findUnique({
        where: { id: createCellRentalDto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Клиент с ID ${createCellRentalDto.clientId} не найден`);
      }

      // Проверяем, существуют ли все ячейки
      const cells = await this.prisma.cells.findMany({
        where: { id: { in: cellsToRent } },
      });

      if (cells.length !== cellsToRent.length) {
        const foundCellIds = cells.map(c => c.id);
        const missingCellIds = cellsToRent.filter(id => !foundCellIds.includes(id));
        throw new NotFoundException(`Ячейки с ID ${missingCellIds.join(', ')} не найдены`);
      }

      // Проверяем, нет ли уже активной аренды для этих ячеек
      const activeRentals = await this.prisma.cellRental.findMany({
        where: {
          cell: {
            some: {
              id: { in: cellsToRent }
            }
          },
          isActive: true,
        },
        include: {
          cell: true
        }
      });

      if (activeRentals.length > 0) {
        const occupiedCells = activeRentals.flatMap(rental => 
          rental.cell.map(c => c.name)
        );
        this.logger.warn(`Attempted to rent already active cells: ${occupiedCells.join(', ')}`, 'CellRentalsService');
        throw new BadRequestException(`Ячейки ${occupiedCells.join(', ')} уже заняты`);
      }

      // Создаем новую аренду без cellId
      const { cellId, cellIds, ...rentalData } = createCellRentalDto;
      
      const newRental = await this.prisma.cellRental.create({
        data: {
          ...rentalData,
          startDate: new Date(createCellRentalDto.startDate),
          endDate: new Date(createCellRentalDto.endDate),
          lastExtendedAt: createCellRentalDto.lastExtendedAt
            ? new Date(createCellRentalDto.lastExtendedAt)
            : undefined,
          cell: {
            connect: cellsToRent.map(id => ({ id }))
          }
        }
      });

      this.logger.log(`New cell rental created with id: ${newRental.id}`, 'CellRentalsService');
      return this.findOne(newRental.id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Конфликт данных при создании аренды');
        } else if (error.code === 'P2003') {
          throw new NotFoundException('Один из связанных объектов не найден');
        }
      }

      throw new InternalServerErrorException(`Ошибка при создании аренды: ${error.message}`);
    }
  }

  // Получение аренды по ID
  async findOne(id: string) {
    this.logger.log(`Fetching cell rental with id: ${id}`, 'CellRentalsService');
    const rental = await this.prisma.cellRental.findUnique({
      where: { id },
      include: {
        cell: {
          include: {
            container: {
              include: {
                location: {
                  include: {
                    city: true,
                  }
                }
              }
            },
            size: true,
            status: true,
          },
        },
        client: {
          include: {
            phones: true,
            user: {
              select: {
                email: true,
              }
            }
          }
        },
        status: true,
        payments: {
          select: {
            id: true,
            amount: true,
            description: true,
            rentalDuration: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!rental) {
      this.logger.warn(`Cell rental with id: ${id} not found`, 'CellRentalsService');
      throw new NotFoundException(`Аренда с ID ${id} не найдена`);
    }

    return rental;
  }

  // Обновление аренды
  async update(id: string, updateCellRentalDto: UpdateCellRentalDto) {
    this.logger.log(`Updating cell rental with id: ${id}`, 'CellRentalsService');
    try {
      await this.findOne(id); // Проверяем существование

      // Проверяем существование клиента, если указан
      if (updateCellRentalDto.clientId) {
        const client = await this.prisma.client.findUnique({
          where: { id: updateCellRentalDto.clientId },
        });

        if (!client) {
          throw new NotFoundException(`Клиент с ID ${updateCellRentalDto.clientId} не найден`);
        }
      }

      // Обработка ячеек для обновления
      let cellUpdateData = {};
      
      // Определяем ячейки для обновления
      const cellsToUpdate: string[] = [];
      if (updateCellRentalDto.cellId) {
        cellsToUpdate.push(updateCellRentalDto.cellId);
      }
      if (updateCellRentalDto.cellIds) {
        cellsToUpdate.push(...updateCellRentalDto.cellIds);
      }

      if (cellsToUpdate.length > 0) {
        // Проверяем существование всех ячеек
        const cells = await this.prisma.cells.findMany({
          where: { id: { in: cellsToUpdate } },
        });

        if (cells.length !== cellsToUpdate.length) {
          const foundCellIds = cells.map(c => c.id);
          const missingCellIds = cellsToUpdate.filter(id => !foundCellIds.includes(id));
          throw new NotFoundException(`Ячейки с ID ${missingCellIds.join(', ')} не найдены`);
        }

        // Проверяем, нет ли уже активной аренды для этих ячеек другим клиентом
        const activeRentals = await this.prisma.cellRental.findMany({
          where: {
            cell: {
              some: {
                id: { in: cellsToUpdate }
              }
            },
            isActive: true,
            id: { not: id }, // Исключаем текущую аренду
          },
          include: {
            client: true,
            cell: true
          }
        });

        if (activeRentals.length > 0) {
          // Получаем текущую аренду для сравнения клиентов
          const currentRental = await this.prisma.cellRental.findUnique({
            where: { id },
            include: { client: true }
          });

          // Проверяем, принадлежат ли активные аренды другим клиентам
          const conflictingRentals = activeRentals.filter(rental => 
            rental.clientId !== currentRental?.clientId
          );

          if (conflictingRentals.length > 0) {
            const occupiedCells = conflictingRentals.flatMap(rental => rental.cell.map(c => c.name));
            throw new BadRequestException(`Ячейки ${occupiedCells.join(', ')} уже арендованы другими клиентами`);
          }
        }

        // Обновляем связи с ячейками
        cellUpdateData = {
          cell: {
            set: [], // Сначала отключаем все ячейки
            connect: cellsToUpdate.map(id => ({ id })) // Потом подключаем новые
          }
        };
      }

      // Исключаем cellId и cellIds из updateData, так как они обрабатываются отдельно
      const { cellId, cellIds, ...restUpdateData } = updateCellRentalDto;
      
      const updateData = {
        ...restUpdateData,
        ...cellUpdateData, // Добавляем данные для обновления ячеек
        startDate: updateCellRentalDto.startDate
          ? new Date(updateCellRentalDto.startDate)
          : undefined,
        endDate: updateCellRentalDto.endDate
          ? new Date(updateCellRentalDto.endDate)
          : undefined,
        lastExtendedAt: updateCellRentalDto.lastExtendedAt
          ? new Date(updateCellRentalDto.lastExtendedAt)
          : undefined,
        closedAt: updateCellRentalDto.closedAt
          ? new Date(updateCellRentalDto.closedAt)
          : undefined,
      };

      // Автоматическая синхронизация isActive с rentalStatus
      if (updateCellRentalDto.rentalStatus !== undefined) {
        if (updateCellRentalDto.rentalStatus === CellRentalStatus.CLOSED) {
          updateData.isActive = false;
          const closeDate = new Date();
          // Устанавливаем дату закрытия, если она не задана явно
          if (!updateData.closedAt) {
            updateData.closedAt = closeDate;
            updateData.endDate = closeDate;
          }
          // Фиксируем окончание аренды на день закрытия
          if (!updateCellRentalDto.endDate) {
            updateData.endDate = closeDate;
          }
        } else {
          updateData.isActive = true;
          // Сбрасываем дату закрытия, если статус не CLOSED
          updateData.closedAt = undefined;
        }
      }

      const updatedRental = await this.prisma.cellRental.update({
        where: { id },
        data: updateData,
        include: {
          cell: {
            include: {
              container: true,
              size: true,
              status: true,
            },
          },
          client: true,
          status: true,
        },
      });

      this.logger.log(`Cell rental with id: ${id} updated successfully`, 'CellRentalsService');
      return this.findOne(updatedRental.id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Конфликт данных при обновлении аренды');
        } else if (error.code === 'P2003') {
          throw new NotFoundException('Один из связанных объектов не найден');
        }
      }

      throw new InternalServerErrorException(`Ошибка при обновлении аренды: ${error.message}`);
    }
  }

  // Удаление аренды
  async remove(id: string) {
    this.logger.log(`Removing cell rental with id: ${id}`, 'CellRentalsService');
    // Проверяем существование аренды
    const rental = await this.findOne(id);

    // Получаем связанные с арендой платежи
    const relatedPayments = await this.prisma.payment.findMany({
      where: { cellRentalId: id }
    });

    // Начинаем транзакцию для атомарного удаления связанных данных
    return this.prisma.$transaction(async (prisma) => {
      // Отвязываем платежи от аренды
      // if (relatedPayments.length > 0) {
      //   await prisma.payment.updateMany({
      //     where: { cellRentalId: id },
      //     data: {
      //       cellRentalId: null,
      //       description: `Платеж за удаленную аренду ячейки ${rental?.cell?.name || ''}`
      //     }
      //   });
      // }

      // Удаляем аренду
      await prisma.cellRental.delete({
        where: { id },
      });

      this.logger.log(`Cell rental with id: ${id} removed successfully`, 'CellRentalsService');
      return { id };
    });
  }

  // Получение активных аренд клиента
  async findActiveRentalsByClient(clientId: string) {
    this.logger.log(`Fetching active rentals for client id: ${clientId}`, 'CellRentalsService');
    return this.prisma.cellRental.findMany({
      where: {
        clientId,
        isActive: true,
      },
      include: {
        cell: {
          include: {
            container: true,
            size: true,
            status: true,
          },
        },
        status: true,
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        endDate: 'asc',
      },
    });
  }

  // Получение всех аренд клиента (включая историю)
  async findAllRentalsByClient(clientId: string) {
    this.logger.log(`Fetching all rentals for client id: ${clientId}`, 'CellRentalsService');
    return this.prisma.cellRental.findMany({
      where: {
        clientId,
      },
      include: {
        cell: {
          include: {
            container: {
              include: {
                location: {
                  include: {
                    city: true,
                  }
                }
              }
            },
            size: true,
            status: true,
          },
        },
        status: true,
        payments: {
          select: {
            id: true,
            amount: true,
            description: true,
            rentalDuration: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Получение истории аренд для ячейки
  async findRentalHistoryByCell(cellId: string) {
    this.logger.log(`Fetching rental history for cell id: ${cellId}`, 'CellRentalsService');
    return this.prisma.cellRental.findMany({
      where: {
        cell: {
          some: {
            id: cellId
          }
        }
      },
      include: {
        client: true,
        status: true,
        cell: true, // Включаем ячейки
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Закрытие аренды
  async closeRental(id: string) {
    this.logger.log(`Closing rental with id: ${id}`, 'CellRentalsService');
    const rental = await this.findOne(id);

    // if (!rental.isActive) {
    //   throw new BadRequestException(`Аренда с ID ${id} уже закрыта`);
    // }

    // Обновляем статусы
    await this.calculateAndUpdateRentalStatus(id, CellRentalStatus.CLOSED);

    const closeDate = new Date();

    return this.prisma.cellRental.update({
      where: { id },
      data: {
        isActive: false,
        closedAt: closeDate,
        endDate: closeDate,
        rentalStatus: CellRentalStatus.CLOSED
      },
      include: {
        cell: true,
        client: true,
        status: true
      },
    });
  }

  // Обновление статуса аренды (автоматическое или ручное)
  async calculateAndUpdateRentalStatus(id: string, forceStatus?: CellRentalStatus) {
    this.logger.log(`Updating rental status for id: ${id}`, 'CellRentalsService');
    const rental = await this.prisma.cellRental.findUnique({
      where: { id },
      include: {
        status: true,
        payments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!rental) {
      throw new NotFoundException(`Аренда с ID ${id} не найдена`);
    }

    let newStatus: CellRentalStatus;

    if (forceStatus) {
      // Если статус задан принудительно, используем его
      newStatus = forceStatus;
    } else if (!rental.isActive) {
      // Если аренда неактивна, проверяем, не просрочена ли она
      const now = new Date();
      const endDate = new Date(rental.endDate);
      if (endDate < now && !rental.closedAt) {
        newStatus = CellRentalStatus.EXPIRED;
      } else {
        newStatus = CellRentalStatus.CLOSED;
      }
    } else {
      // Иначе определяем статус по дате окончания
      const now = new Date();
      const endDate = new Date(rental.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Проверяем наличие продлений
      const wasExtended = rental.extensionCount > 0 &&
        rental.lastExtendedAt &&
        new Date(rental.lastExtendedAt).getTime() > now.getTime() - 1000 * 60 * 60 * 24 * 7; // Продлен в течение последней недели

      // Проверяем, является ли аренда бронью (начало в будущем)
      const isReservation = new Date(rental.startDate).getTime() > now.getTime();

      if (isReservation) {
        newStatus = CellRentalStatus.RESERVATION; // Бронь
      } else if (daysLeft <= 1) {
        // Просрочена, если осталось 1 день или меньше
        newStatus = CellRentalStatus.EXPIRED;
      } else if (daysLeft <= 3) {
        // Предупреждение за 3 дня
        newStatus = CellRentalStatus.EXPIRING_SOON;
      } else if (daysLeft <= 7) {
        // Уведомление за 7 дней
        newStatus = CellRentalStatus.PAYMENT_SOON;
      } else if (wasExtended) {
        newStatus = CellRentalStatus.EXTENDED; // Недавно продлен
      } else {
        newStatus = CellRentalStatus.ACTIVE; // Активная
      }
    }

    // Проверяем, изменился ли статус
    if (rental.rentalStatus !== newStatus) {
      // Поиск подходящего визуального статуса в CellStatus
      const matchingStatus = await this.prisma.cellStatus.findFirst({
        where: {
          statusType: newStatus
        }
      });

      // Обновляем аренду с новым статусом
      await this.prisma.cellRental.update({
        where: { id },
        data: {
          rentalStatus: newStatus,
          // Устанавливаем визуальный статус, если есть подходящий
          isActive: newStatus !== CellRentalStatus.CLOSED,
          closedAt: newStatus === CellRentalStatus.CLOSED ? new Date() : null,
          statusId: matchingStatus ? matchingStatus.id : rental.statusId
        }
      });

      this.logger.log(`Rental status for id ${id} updated to ${newStatus}`, 'CellRentalsService');
      return true;
    }

    return false;
  }

  /**
   * Принудительное обновление статуса аренды
   */
  // Обновление только статуса аренды
  async updateRentalStatus(id: string, updateRentalStatusDto: UpdateRentalStatusDto) {
    this.logger.log(`Updating rental status for id: ${id} to ${updateRentalStatusDto.rentalStatus}`, 'CellRentalsService');
    try {
      const rental = await this.findOne(id); // Проверяем существование

      const updateData: any = {
        rentalStatus: updateRentalStatusDto.rentalStatus,
      };

      // Автоматическая синхронизация isActive с rentalStatus
      if (updateRentalStatusDto.rentalStatus === CellRentalStatus.CLOSED) {
        updateData.isActive = false;
        const closeDate = new Date();
        updateData.closedAt = closeDate;
        updateData.endDate = closeDate;
      } else {
        updateData.isActive = true;
        updateData.closedAt = null;
      }

      const updatedRental = await this.prisma.cellRental.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`Rental status updated for id: ${id}`, 'CellRentalsService');
      return this.findOne(updatedRental.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Аренда с ID ${id} не найдена`);
        }
      }

      this.logger.error(`Failed to update rental status: ${error.message}`, error.stack, 'CellRentalsService');
      throw new InternalServerErrorException(`Ошибка при обновлении статуса аренды: ${error.message}`);
    }
  }

  async forceRentalStatus(id: string, status: CellRentalStatus) {
    this.logger.log(`Force updating rental status for id: ${id} to ${status}`, 'CellRentalsService');

    const rental = await this.prisma.cellRental.update({
      where: { id },
      data: {
        rentalStatus: status,
        isActive: status !== CellRentalStatus.CLOSED,
        closedAt: status === CellRentalStatus.CLOSED ? new Date() : null,
      },
      include: {
        cell: true,
        client: true,
        status: true,
      },
    });

    return rental;
  }

  // Обновление статусов всех активных аренд
  async updateAllRentalStatuses() {
    this.logger.log('Updating statuses for all active rentals', 'CellRentalsService');
    const activeRentals = await this.prisma.cellRental.findMany({
      select: {
        id: true
      }
    });

    let updatedCount = 0;
    for (const rental of activeRentals) {
      try {
        await this.calculateAndUpdateRentalStatus(rental.id);
        updatedCount++;
      } catch (error) {
        this.logger.error(`Failed to update status for rental ${rental.id}: ${error.message}`, error.stack, 'CellRentalsService');
      }
    }
    this.logger.log(`Updated statuses for ${updatedCount} rentals.`, 'CellRentalsService');
    return { updatedCount };
  }

  // Синхронизация визуальных статусов со статусами аренды
  async syncAllRentalVisualStatuses() {
    this.logger.log('Syncing visual statuses for all rentals', 'CellRentalsService');
    
    const rentals = await this.prisma.cellRental.findMany({
      include: {
        status: true
      }
    });

    let syncedCount = 0;
    for (const rental of rentals) {
      try {
        // Найти правильный визуальный статус для текущего rentalStatus
        const correctStatus = await this.prisma.cellStatus.findFirst({
          where: {
            statusType: rental.rentalStatus
          }
        });

        // Если статус найден и отличается от текущего
        if (correctStatus && rental.statusId !== correctStatus.id) {
          await this.prisma.cellRental.update({
            where: { id: rental.id },
            data: {
              statusId: correctStatus.id
            }
          });
          
          this.logger.log(`Synced visual status for rental ${rental.id}: ${rental.rentalStatus} -> ${correctStatus.name}`, 'CellRentalsService');
          syncedCount++;
        }
      } catch (error) {
        this.logger.error(`Failed to sync visual status for rental ${rental.id}: ${error.message}`, error.stack, 'CellRentalsService');
      }
    }

    this.logger.log(`Synced visual statuses for ${syncedCount} rentals.`, 'CellRentalsService');
    return { syncedCount };
  }

  // Продление аренды (с созданием платежа)
  async extendRental(extendCellRentalDto: ExtendCellRentalDto) {
    const { cellRentalId, amount, description, rentalDuration } = extendCellRentalDto;
    this.logger.log(`Extending rental ${cellRentalId}`, 'CellRentalsService');

    // Находим аренду
    const rental = await this.findOne(cellRentalId);

    // Проверяем, что у клиента есть userId
    if (!rental.client?.userId) {
      this.logger.error(`Rental ${cellRentalId} has no linked client with a user account.`, 'CellRentalsService');
      throw new BadRequestException(`Аренда не привязана к аккаунту пользователя и не может быть продлена автоматически.`);
    }

    // Создаем платеж
    this.logger.log(`Creating payment for rental extension: ${cellRentalId}`, 'CellRentalsService');
    const payment = await this.prisma.payment.create({
      data: {
        amount,
        description: description || `Продление аренды ячеек #${rental?.cell?.map(c => c.name).join(', ') || 'неизвестно'}`,
        userId: rental.client.userId, // Используем ID пользователя из связанного клиента
        cellRentalId,
        status: true, // Предполагаем, что платеж сразу успешный (для админа)
        rentalDuration: rentalDuration || 30, // Сохраняем срок в платеже
      },
    });

    // Рассчитываем новую дату окончания аренды
    const daysToAdd = rentalDuration || 30; // По умолчанию 30 дней
    const now = new Date();
    const currentEndDate = new Date(rental.endDate);

    // Если аренда активна и не просрочена, продлеваем от даты окончания.
    // Иначе (если закрыта или просрочена) — продлеваем от сегодняшнего дня.
    const baseDate = rental.isActive && currentEndDate > now ? currentEndDate : now;

    const newEndDate = new Date(baseDate);
    newEndDate.setDate(newEndDate.getDate() + daysToAdd);

    this.logger.log(`Updating rental ${cellRentalId} with new end date: ${newEndDate}`, 'CellRentalsService');

    // Готовим данные для обновления
    const updateData: Prisma.CellRentalUpdateInput = {
      endDate: newEndDate,
      lastExtendedAt: new Date(),
      extensionCount: { increment: 1 },
    };

    // Если аренда была неактивна, активируем её снова
    if (!rental.isActive) {
      updateData.isActive = true;
      updateData.closedAt = null; // Сбрасываем дату закрытия
      await this.calculateAndUpdateRentalStatus(cellRentalId, CellRentalStatus.ACTIVE); // Обновляем статус
    }

    // Обновляем аренду
    const updatedRental = await this.prisma.cellRental.update({
      where: { id: cellRentalId },
      data: updateData,
      include: {
        cell: {
          include: {
            container: true,
            size: true,
          },
        },
        client: true,
        status: true,
      },
    });

    // Добавляем обновление статуса
    await this.calculateAndUpdateRentalStatus(cellRentalId, CellRentalStatus.EXTENDED);

    return updatedRental;
  }

  // Привязка существующего платежа к аренде
  async attachPaymentToRental(paymentId: string, rentalId: string) {
    this.logger.log(`Attaching payment ${paymentId} to rental ${rentalId}`, 'CellRentalsService');
    
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException(`Платеж с ID ${paymentId} не найден`);
    }

    const rental = await this.findOne(rentalId);

    // Обновляем платеж
    this.logger.log(`Updating payment ${paymentId} to link with rental ${rentalId}`, 'CellRentalsService');
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        cellRentalId: rentalId,
      },
    });

    // Вместо ручного расчета используем общий метод пересчета
    await this.recalculateRentalDuration(rentalId);

    // Обновляем статус
    await this.calculateAndUpdateRentalStatus(rentalId);

    return this.findOne(rentalId);
  }

  // Методы для управления статусами ячеек в контексте аренды
  async setCellStatus(cellId: string, statusId: string) {
    this.logger.log(`Setting status ${statusId} for cell ${cellId}`, 'CellRentalsService');
    try {
      // Проверяем, существует ли статус
      const status = await this.prisma.cellStatus.findUnique({
        where: { id: statusId }
      });

      if (!status) {
        throw new NotFoundException(`Статус с ID ${statusId} не найден`);
      }

      // Устанавливаем статус для ячейки
      return await this.prisma.cells.update({
        where: { id: cellId },
        data: { statusId },
        include: {
          status: true,
          container: true
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Ячейка с ID ${cellId} не найдена`);
    }
  }

  async removeCellStatus(cellId: string) {
    this.logger.log(`Removing status from cell ${cellId}`, 'CellRentalsService');
    try {
      // Проверяем наличие активной аренды для этой ячейки
      const activeRental = await this.prisma.cellRental.findFirst({
        where: {
          cell: {
            some: {
              id: cellId
            }
          },
          isActive: true,
        },
      });

      if (activeRental) {
        throw new BadRequestException(`Невозможно удалить статус у ячейки с ID ${cellId}, так как она находится в активной аренде`);
      }

      // Удаляем статус у ячейки
      return await this.prisma.cells.update({
        where: { id: cellId },
        data: { statusId: null },
        include: {
          status: true,
          container: true
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException(`Ячейка с ID ${cellId} не найдена`);
    }
  }

  // Получение данных для диаграммы Ганта
  async findGanttRentals(query: FindGanttRentalsDto) {
    this.logger.log(`Fetching rentals for Gantt chart: ${JSON.stringify(query)}`, 'CellRentalsService');

    try {
      const { startDate, endDate, limit = 1000 } = query;

      const cells = await this.prisma.cells.findMany({
        select: {
          id: true,
          name: true,
          container: {
            select: {
              name: true,
            }
          },
          rentals: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              isActive: true,
              rentalStatus: true,
              status: {
                select: {
                  name: true,
                  color: true,
                  statusType: true
                }
              },
              payments: {
                where: { status: true },
                select: {
                  id: true,
                  status: true,
                  createdAt: true,
                  rentalDuration: true,
                  description: true
                },
                orderBy: { createdAt: 'asc' }
              }
            },
            where: startDate || endDate ? {
              OR: [
                {
                  startDate: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                  }
                },
                {
                  endDate: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                  }
                },
                {
                  AND: [
                    { startDate: { lte: startDate ? new Date(startDate) : undefined } },
                    { endDate: { gte: endDate ? new Date(endDate) : undefined } }
                  ]
                }
              ]
            } : undefined,
            orderBy: [
              { startDate: 'asc' },
              { createdAt: 'asc' }
            ],
          }
        },
        where: {
          rentals: {
            some: startDate || endDate ? {
              OR: [
                {
                  startDate: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                  }
                },
                {
                  endDate: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                  }
                },
                {
                  AND: [
                    { startDate: { lte: startDate ? new Date(startDate) : undefined } },
                    { endDate: { gte: endDate ? new Date(endDate) : undefined } }
                  ]
                }
              ]
            } : {}
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      const rentals = cells.flatMap(cell =>
        cell.rentals.map(rental => {
          // Логируем проблемные случаи
          if (rental.rentalStatus && rental.status && rental.status.statusType !== rental.rentalStatus) {
            this.logger.warn(
              `Mismatch for rental ${rental.id}: rentalStatus=${rental.rentalStatus}, status.statusType=${rental.status.statusType}`,
              'CellRentalsService'
            );
          }

          return {
            id: rental.id,
            startDate: rental.startDate,
            endDate: rental.endDate,
            isActive: rental.isActive,
            rentalStatus: rental.rentalStatus,
            cell: {
              id: cell.id,
              name: cell.name,
              containerName: cell.container.name
            },
            status: rental.status,
            payments: rental.payments
          };
        })
      );

      return {
        data: rentals,
        meta: {
          count: rentals.length,
          cellsCount: cells.length,
          startDate: startDate || null,
          endDate: endDate || null
        }
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Gantt rentals: ${error.message}`, error.stack, 'CellRentalsService');
      throw new InternalServerErrorException(`Ошибка при получении данных для диаграммы Ганта: ${error.message}`);
    }
  }

  /**
   * Правильно рассчитывает дату окончания аренды с использованием календарных периодов
   */
  private _calculateRentalEndDate(startDate: Date, value: number, unit: string): Date {
    const endDate = new Date(startDate);
    
    if (unit.startsWith('мес')) {
      // Добавляем месяцы - точно календарные месяцы
      endDate.setMonth(endDate.getMonth() + value);
      endDate.setDate(endDate.getDate() - 1); // Вычитаем 1 день для корректной даты окончания
    } else if (unit.startsWith('дн') || unit.startsWith('day')) {
      // Добавляем дни
      endDate.setDate(endDate.getDate() + value - 1); // Вычитаем 1 день для корректной даты окончания
    } else if (unit.startsWith('год') || unit.startsWith('year')) {
      // Добавляем годы - точно календарные годы
      endDate.setFullYear(endDate.getFullYear() + value);
      endDate.setDate(endDate.getDate() - 1); // Вычитаем 1 день для корректной даты окончания
    }
    
    return endDate;
  }

  /**
   * Извлекает информацию о периоде аренды из описания платежа
   */
  private _extractRentalPeriodFromDescription(description: string): { value: number; unit: string } {
    // Пытаемся найти информацию о периоде в описании
    const durationMatch = description.match(/(\d+)\s*(мес|дн|день|месяц|год)/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1], 10);
      const unit = durationMatch[2].toLowerCase();
      if (!isNaN(value)) {
        return { value, unit };
      }
    }
    
    // По умолчанию 1 месяц
    return { value: 1, unit: 'мес' };
  }

  // Добавим новый метод для пересчета срока аренды с использованием календарных дат
  async recalculateRentalDuration(rentalId: string) {
    this.logger.log(`Recalculating rental duration for rental ${rentalId}`, 'CellRentalsService');
    
    const rental = await this.findOne(rentalId);
    
    // Получаем все успешные платежи аренды отсортированные по дате создания
    const allPayments = await this.prisma.payment.findMany({
      where: { 
        cellRentalId: rentalId,
        status: true // только успешные платежи
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    this.logger.log(`Found ${allPayments.length} successful payments for rental ${rentalId}`, 'CellRentalsService');

    // Рассчитываем новую дату окончания поэтапно
    let currentEndDate = new Date(rental.startDate);
    
    for (const payment of allPayments) {
      const period = this._extractRentalPeriodFromDescription(payment.description || '');
      currentEndDate = this._calculateRentalEndDate(currentEndDate, period.value, period.unit);
      
      this.logger.log(
        `Payment ${payment.id}: +${period.value} ${period.unit}, new end date: ${currentEndDate.toISOString()}`,
        'CellRentalsService'
      );
    }

    this.logger.log(`Final calculated end date for rental ${rentalId}: ${currentEndDate}`, 'CellRentalsService');

    // Обновляем аренду
    const updatedRental = await this.prisma.cellRental.update({
      where: { id: rentalId },
      data: {
        endDate: currentEndDate,
      },
      include: {
        cell: true,
        client: true,
        status: true,
      },
    });

    // Добавляем пересчет статуса
    await this.calculateAndUpdateRentalStatus(rentalId);

    return updatedRental;
  }

}