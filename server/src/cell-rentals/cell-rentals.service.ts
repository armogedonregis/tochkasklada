import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellRentalDto, UpdateCellRentalDto, ExtendCellRentalDto, FindCellRentalsDto, CellRentalSortField, SortDirection } from './dto';
import { CellRentalStatus, Prisma } from '@prisma/client';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { Logger } from '@nestjs/common';

@Injectable()
export class CellRentalsService {
  // private readonly logger = new Logger(CellRentalsService.name);
  
  constructor(private readonly prisma: PrismaService) {}

  // Создание новой аренды ячейки
  async create(createCellRentalDto: CreateCellRentalDto) {
    try {
      // Проверяем, существует ли ячейка
      const cell = await this.prisma.cells.findUnique({
        where: { id: createCellRentalDto.cellId },
      });

      if (!cell) {
        throw new NotFoundException(`Ячейка с ID ${createCellRentalDto.cellId} не найдена`);
      }

      // Проверяем, существует ли клиент
      const client = await this.prisma.client.findUnique({
        where: { id: createCellRentalDto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Клиент с ID ${createCellRentalDto.clientId} не найден`);
      }

      // Проверяем, нет ли уже активной аренды для этой ячейки
      const activeRental = await this.prisma.cellRental.findFirst({
        where: {
          cellId: createCellRentalDto.cellId,
          isActive: true,
        },
      });

      if (activeRental) {
        throw new BadRequestException(`Ячейка с ID ${createCellRentalDto.cellId} уже арендована`);
      }

      // Создаем новую аренду
      return this.prisma.cellRental.create({
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

  // Получение всех аренд
  async findAll() {
    return this.prisma.cellRental.findMany({
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

  // Получение аренды по ID
  async findOne(id: string) {
    const rental = await this.prisma.cellRental.findUnique({
      where: { id },
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
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!rental) {
      throw new NotFoundException(`Аренда с ID ${id} не найдена`);
    }

    return rental;
  }

  // Обновление аренды
  async update(id: string, updateCellRentalDto: UpdateCellRentalDto) {
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

      return this.prisma.cellRental.update({
        where: { id },
        data: {
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
    await this.findOne(id); // Проверяем существование

    return this.prisma.cellRental.delete({
      where: { id },
    });
  }

  // Получение активных аренд клиента
  async findActiveRentalsByClient(clientId: string) {
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
    return this.prisma.cellRental.findMany({
      where: {
        clientId,
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
        createdAt: 'desc',
      },
    });
  }

  // Получение истории аренд для ячейки
  async findRentalHistoryByCell(cellId: string) {
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
    const rental = await this.findOne(id);

    if (!rental.isActive) {
      throw new BadRequestException(`Аренда с ID ${id} уже закрыта`);
    }

    // Обновляем статусы
    await this.updateRentalStatus(id, CellRentalStatus.CLOSED);

    return this.prisma.cellRental.update({
      where: { id },
      data: {
        isActive: false,
        closedAt: new Date(),
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
      // Если аренда неактивна, статус - CLOSED
      newStatus = CellRentalStatus.CLOSED;
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
          statusId: matchingStatus ? matchingStatus.id : rental.statusId
        }
      });

      return true;
    }

    return false;
  }

  // Задача по расписанию для автоматического обновления статусов аренд
  // Запускается каждый день в 00:00
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async handleAutomaticStatusUpdates() {
  //   this.logger.log('Запуск автоматического обновления статусов аренд...');
    
  //   try {
  //     const result = await this.updateAllRentalStatuses();
      
  //     this.logger.log(
  //       `Обновление статусов завершено: обработано ${result.processed} аренд, обновлено ${result.updated} статусов`
  //     );
  //   } catch (error) {
  //     this.logger.error('Ошибка при обновлении статусов аренд:', error.stack);
  //   }
  // }

  // Обновление статусов всех активных аренд
  async updateAllRentalStatuses() {
    const activeRentals = await this.prisma.cellRental.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true
      }
    });

    const results = await Promise.all(
      activeRentals.map(rental => this.updateRentalStatus(rental.id))
    );

    return {
      processed: activeRentals.length,
      updated: results.filter(result => result).length
    };
  }

  // Продление аренды (с созданием платежа)
  async extendRental(userId: string, extendCellRentalDto: ExtendCellRentalDto) {
    const { cellRentalId, amount, description } = extendCellRentalDto;
    
    // Находим аренду
    const rental = await this.findOne(cellRentalId);
    
    // Проверяем активность аренды
    if (!rental.isActive) {
      throw new BadRequestException(`Аренда с ID ${cellRentalId} не активна и не может быть продлена`);
    }
    
    // Находим пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    // Создаем платеж
    const payment = await this.prisma.payment.create({
      data: {
        amount,
        description: description || `Продление аренды ячейки #${rental.cell.name}`,
        userId,
        cellRentalId,
        status: true, // Предполагаем, что платеж сразу успешный (для админа)
      },
    });
    
    // Рассчитываем новую дату окончания аренды (добавляем 1 месяц)
    const newEndDate = new Date(rental.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    
    // Обновляем аренду
    return this.prisma.cellRental.update({
      where: { id: cellRentalId },
      data: {
        endDate: newEndDate,
        lastExtendedAt: new Date(),
        extensionCount: { increment: 1 },
      },
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
  }

  // Привязка существующего платежа к аренде
  async attachPaymentToRental(paymentId: string, rentalId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    
    if (!payment) {
      throw new NotFoundException(`Платеж с ID ${paymentId} не найден`);
    }
    
    const rental = await this.findOne(rentalId);
    
    // Обновляем платеж
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        cellRentalId: rentalId,
      },
    });
    
    // Обновляем дату окончания аренды (добавляем 1 месяц)
    const newEndDate = new Date(rental.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    
    // Обновляем аренду
    return this.prisma.cellRental.update({
      where: { id: rentalId },
      data: {
        endDate: newEndDate,
        lastExtendedAt: new Date(),
        extensionCount: { increment: 1 },
      },
      include: {
        cell: true,
        client: true,
        status: true,
      },
    });
  }

  // Методы для управления статусами ячеек в контексте аренды
  async setCellStatus(cellId: string, statusId: string) {
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

  // Получение аренд с фильтрацией, поиском и пагинацией
  async findCellRentals(queryParams: FindCellRentalsDto) {
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
      throw new InternalServerErrorException(`Ошибка при получении списка аренд: ${error.message}`);
    }
  }
} 