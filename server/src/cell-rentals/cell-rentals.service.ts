import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellRentalDto, UpdateCellRentalDto, ExtendCellRentalDto, FindCellRentalsDto, CellRentalSortField, SortDirection } from './dto';
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
        clientId,
        statusId
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

      // Фильтр по ID ячейки
      if (cellId) {
        where.cellId = cellId;
      }

      // Фильтр по ID клиента
      if (clientId) {
        where.clientId = clientId;
      }

      // Фильтр по ID статуса ячейки
      if (statusId) {
        where.cell = {
          statusId
        };
      }

      // Поиск по строке
      if (search) {
        where.OR = [
          // Поиск по имени клиента
          { client: { name: { contains: search, mode: 'insensitive' } } },
          // Поиск по номеру телефона клиента
          { client: { phones: { some: { phone: { contains: search, mode: 'insensitive' } } } } },
          // Поиск по имени ячейки
          { cell: { name: { contains: search, mode: 'insensitive' } } }
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
              container: true,
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
        page = 1,
        limit = 10,
        sortBy = CellRentalSortField.CREATED_AT,
        sortDirection = SortDirection.DESC,
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
          orderBy.createdAt = sortDirection;
          break;
      }


      // Запрос на получение общего количества
      const totalCount = await this.prisma.cells.count({
        where: {
          ...where,
          // Исключаем ячейки с активными арендами
          AND: [
            {
              OR: [
                // Ячейка не имеет аренд
                { rentals: { none: {} } },
                // Все аренды ячейки не активны
                { rentals: { every: { isActive: false } } }
              ]
            }
          ]
        }
      });

      // Находим все ячейки, у которых нет активных аренд
      // или с определенным статусом
      const cells = await this.prisma.cells.findMany({
        where: {
          ...where,
          // Исключаем ячейки с активными арендами
          AND: [
            {
              OR: [
                // Ячейка не имеет аренд
                { rentals: { none: {} } },
                // Все аренды ячейки не активны
                { rentals: { every: { isActive: false } } }
              ]
            }
          ]
        },
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
    this.logger.log(`Creating new cell rental for cellId: ${createCellRentalDto.cellId}`, 'CellRentalsService');
    try {
      // Проверяем, существует ли клиент
      const client = await this.prisma.client.findUnique({
        where: { id: createCellRentalDto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Клиент с ID ${createCellRentalDto.clientId} не найден`);
      }

      // Проверяем, существует ли ячейка
      const cell = await this.prisma.cells.findUnique({
        where: { id: createCellRentalDto.cellId },
      });

      if (!cell) {
        throw new NotFoundException(`Ячейка с ID ${createCellRentalDto.cellId} не найдена`);
      }

      // Проверяем, нет ли уже активной аренды для этой ячейки
      const activeRental = await this.prisma.cellRental.findFirst({
        where: {
          cellId: createCellRentalDto.cellId,
          isActive: true,
        },
      });

      if (activeRental) {
        this.logger.warn(`Attempted to rent an already active cell. CellId: ${createCellRentalDto.cellId}`, 'CellRentalsService');
        throw new BadRequestException(`Ячейка ${cell.name} уже занята`);
      }

      // Создаем новую аренду
      const newRental = await this.prisma.cellRental.create({
        data: {
          ...createCellRentalDto,
          startDate: new Date(createCellRentalDto.startDate),
          endDate: new Date(createCellRentalDto.endDate),
          lastExtendedAt: createCellRentalDto.lastExtendedAt
            ? new Date(createCellRentalDto.lastExtendedAt)
            : undefined,
        },
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

      // Проверяем существование ячейки, если указана
      if (updateCellRentalDto.cellId) {
        const cell = await this.prisma.cells.findUnique({
          where: { id: updateCellRentalDto.cellId },
        });

        if (!cell) {
          throw new NotFoundException(`Ячейка с ID ${updateCellRentalDto.cellId} не найдена`);
        }

        // Проверяем, нет ли уже активной аренды для этой ячейки
        const activeRental = await this.prisma.cellRental.findFirst({
          where: {
            cellId: updateCellRentalDto.cellId,
            isActive: true,
            id: { not: id }, // Исключаем текущую аренду
          },
        });

        if (activeRental) {
          throw new BadRequestException(`Ячейка с ID ${updateCellRentalDto.cellId} уже арендована`);
        }
      }

      const updateData = {
        ...updateCellRentalDto,
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
        cellId,
      },
      include: {
        client: true,
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
    await this.updateRentalStatus(id, CellRentalStatus.CLOSED);

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
  async updateRentalStatus(id: string, forceStatus?: CellRentalStatus) {
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

      // Проверяем скорую оплату (от 7 до 14 дней до окончания)
      const paymentDueSoon = daysLeft > 7 && daysLeft <= 14;

      // Проверяем, является ли аренда бронью (начало в будущем)
      const isReservation = new Date(rental.startDate).getTime() > now.getTime();

      if (isReservation) {
        newStatus = CellRentalStatus.RESERVATION; // Бронь
      } else if (daysLeft < 0) {
        newStatus = CellRentalStatus.EXPIRED; // Просрочена
      } else if (daysLeft <= 7) {
        newStatus = CellRentalStatus.EXPIRING_SOON; // Скоро истекает
      } else if (paymentDueSoon) {
        newStatus = CellRentalStatus.PAYMENT_SOON; // Скоро оплата
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
        await this.updateRentalStatus(rental.id);
        updatedCount++;
      } catch (error) {
        this.logger.error(`Failed to update status for rental ${rental.id}: ${error.message}`, error.stack, 'CellRentalsService');
      }
    }
    this.logger.log(`Updated statuses for ${updatedCount} rentals.`, 'CellRentalsService');
    return { updatedCount };
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
        description: description || `Продление аренды ячейки #${rental?.cell?.name}`,
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
      await this.updateRentalStatus(cellRentalId, CellRentalStatus.ACTIVE); // Обновляем статус
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
    await this.updateRentalStatus(cellRentalId, CellRentalStatus.EXTENDED);

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
    await this.updateRentalStatus(rentalId);

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
          cellId,
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
                  color: true
                }
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
        cell.rentals.map(rental => ({
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
          status: rental.status
        }))
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

  // Добавим новый метод для пересчета срока аренды
  async recalculateRentalDuration(rentalId: string) {
    this.logger.log(`Recalculating rental duration for rental ${rentalId}`, 'CellRentalsService');
    
    const rental = await this.findOne(rentalId);
    
    // Получаем все успешные платежи аренды
    const allPayments = await this.prisma.payment.findMany({
      where: { 
        cellRentalId: rentalId,
        status: true // только успешные платежи
      },
    });

    // Считаем общий срок аренды из всех платежей
    const totalDays = allPayments.reduce((sum, payment) => sum + (payment.rentalDuration || 30), 0);

    // Рассчитываем новую дату окончания от начальной даты аренды
    const newEndDate = new Date(rental.startDate);
    newEndDate.setDate(newEndDate.getDate() + totalDays);

    this.logger.log(`New end date for rental ${rentalId}: ${newEndDate}, total days: ${totalDays}`, 'CellRentalsService');

    // Обновляем аренду
    const updatedRental = await this.prisma.cellRental.update({
      where: { id: rentalId },
      data: {
        endDate: newEndDate,
      },
      include: {
        cell: true,
        client: true,
        status: true,
      },
    });

    // Добавляем пересчет статуса
    await this.updateRentalStatus(rentalId);

    return updatedRental;
  }

}