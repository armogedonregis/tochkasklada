import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { RolesService } from '../../roles/roles.service';
import { CreateCellRentalDto, UpdateCellRentalDto, ExtendCellRentalDto, FindCellRentalsDto, CellRentalSortField, SortDirection, UpdateRentalStatusDto } from './dto';
import { CellRentalStatus, Prisma } from '@prisma/client';
import { CellFreeSortField, FindFreeCellRentalsDto } from './dto/find-free-cells.dto';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { FindGanttRentalsDto } from './dto/find-gantt-rentals.dto';

@Injectable()
export class CellRentalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly rolesService: RolesService,
  ) {
    this.logger.log('CellRentalsService instantiated', 'CellRentalsService');
  }

  async findCellRentals(queryParams: FindCellRentalsDto, currentUser?: { id: string; role: string }) {
    this.logger.log(`Fetching cell rentals with query: ${JSON.stringify(queryParams)}`, 'CellRentalsService');
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = CellRentalSortField.CREATED_AT,
        sortDirection = SortDirection.DESC,
        rentalStatus,
        locationId
      } = queryParams;

      let where: Prisma.CellRentalWhereInput = {};

      if (rentalStatus) {
        if (!where.status) where.status = {};
        where.status.statusType = rentalStatus;
      }

      if (locationId) {
        if (where.cell) {
          where.cell.some = {
            ...where.cell.some,
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

      if (search) {
        where.OR = [
          { client: { name: { contains: search, mode: 'insensitive' } } },
          { client: { phones: { some: { phone: { contains: search, mode: 'insensitive' } } } } },
          { cell: { some: { name: { contains: search, mode: 'insensitive' } } } }
        ];
      }

      const skip = (page - 1) * limit;

      let orderBy: Prisma.CellRentalOrderByWithRelationInput = {};

      switch (sortBy) {
        case CellRentalSortField.START_DATE:
          orderBy.startDate = sortDirection;
          break;
        case CellRentalSortField.END_DATE:
          orderBy.endDate = sortDirection;
          break;
        case CellRentalSortField.RENTAL_STATUS:
          orderBy = { status: { statusType: sortDirection } };
          break;
        case CellRentalSortField.CREATED_AT:
        default:
          orderBy.createdAt = sortDirection;
          break;
      }

      if (currentUser && currentUser.role === 'ADMIN') {
        const admin = await this.prisma.admin.findUnique({ where: { userId: currentUser.id }, select: { id: true } });
        const ids = admin ? await this.rolesService.getAccessibleLocationIdsForAdmin(admin.id) : [];
        if (ids.length > 0) {
          const ands: any[] = Array.isArray((where as any).AND) ? ([...(where as any).AND] as any[]) : ((where as any).AND ? [((where as any).AND as any)] : []);
          ands.push({
            cell: {
              some: {
                container: { location: { id: { in: ids } } }
              }
            }
          });
          (where as any).AND = ands;
        } else {
          return { data: [], meta: { totalCount: 0, page, limit, totalPages: 0 } };
        }
      }

      const totalCount = await this.prisma.cellRental.count({ where });

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
              createdAt: true,
            },
          },
        }
      });

      const totalPages = Math.ceil(totalCount / limit);

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

  async getFreeCells(queryParams: FindFreeCellRentalsDto) {
    this.logger.log(`Fetching free cells with query: ${JSON.stringify(queryParams)}`, 'CellRentalsService');
    try {
      const {
        search,
        locationId,
        sizeId,
        page = 1,
        limit = 10,
        sortBy = CellFreeSortField.LOCATION,
        sortDirection = SortDirection.ASC,
      } = queryParams;

      const where: Prisma.CellsWhereInput = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { comment: { contains: search, mode: 'insensitive' } },

          {
            size: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { short_name: { contains: search, mode: 'insensitive' } }
              ]
            }
          },
          {
            container: {
              OR: [
                { name: { equals: isNaN(Number(search)) ? undefined : Number(search) } },
                {
                  location: {
                    OR: [
                      { name: { contains: search, mode: 'insensitive' } },
                      { short_name: { contains: search, mode: 'insensitive' } },
                      { address: { contains: search, mode: 'insensitive' } },
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

      if (locationId) {
        const andConditions: Prisma.CellsWhereInput[] = Array.isArray((where as any).AND)
          ? ([...(where as any).AND] as Prisma.CellsWhereInput[])
          : ((where as any).AND ? [((where as any).AND as Prisma.CellsWhereInput)] : []);

        andConditions.push({ container: { location: { id: locationId } } });
        (where as any).AND = andConditions;
      }

      if (sizeId) {
        const andConditions: Prisma.CellsWhereInput[] = Array.isArray((where as any).AND)
          ? ([...(where as any).AND] as Prisma.CellsWhereInput[])
          : ((where as any).AND ? [((where as any).AND as Prisma.CellsWhereInput)] : []);

        andConditions.push({ size_id: sizeId });
        (where as any).AND = andConditions;
      }

      const skip = (page - 1) * limit;

      let orderBy: any = {};

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


      const baseAndConditions: Prisma.CellsWhereInput[] = Array.isArray((where as any).AND)
        ? ([...(where as any).AND] as Prisma.CellsWhereInput[])
        : ((where as any).AND ? [((where as any).AND as Prisma.CellsWhereInput)] : []);

      baseAndConditions.push({
        OR: [
          // Без аренд
          { rentals: { none: {} } },
          // ИЛИ все аренды не активные
          { rentals: { every: { status: { statusType: "CLOSED" } } } }
        ]
      });

      const mergedWhere: Prisma.CellsWhereInput = {
        ...where,
        AND: baseAndConditions
      };

      const totalCount = await this.prisma.cells.count({
        where: mergedWhere
      });

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
          rentals: {
            include: {
              status: true,
            },
          }
        },
        orderBy,

      });
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

  async create(createCellRentalDto: CreateCellRentalDto) {
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
      const client = await this.prisma.client.findUnique({
        where: { id: createCellRentalDto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Клиент с ID ${createCellRentalDto.clientId} не найден`);
      }

      const cells = await this.prisma.cells.findMany({
        where: { id: { in: cellsToRent } },
      });

      if (cells.length !== cellsToRent.length) {
        const foundCellIds = cells.map(c => c.id);
        const missingCellIds = cellsToRent.filter(id => !foundCellIds.includes(id));
        throw new NotFoundException(`Ячейки с ID ${missingCellIds.join(', ')} не найдены`);
      }

      const activeRentals = await this.prisma.cellRental.findMany({
        where: {
          cell: {
            some: {
              id: { in: cellsToRent }
            }
          },
          status: { is: { statusType: 'ACTIVE' } },
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
            cellRental: true,
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

  async update(id: string, updateCellRentalDto: UpdateCellRentalDto) {
    this.logger.log(`Updating cell rental with id: ${id}`, 'CellRentalsService');
    try {
      await this.findOne(id);

      let clientUpdateData = {};
      if (updateCellRentalDto.clientId) {
        const client = await this.prisma.client.findUnique({
          where: { id: updateCellRentalDto.clientId },
        });

        if (!client) {
          throw new NotFoundException(`Клиент с ID ${updateCellRentalDto.clientId} не найден`);
        }

        clientUpdateData = {
          client: {
            connect: { id: updateCellRentalDto.clientId }
          }
        };
      }

      let statusUpdateData = {};
      if (updateCellRentalDto.rentalStatus) {
        const status = await this.prisma.cellStatus.findFirst({
          where: { statusType: updateCellRentalDto.rentalStatus },
        });

        if (!status) {
          throw new NotFoundException(`Статус с типом ${updateCellRentalDto.rentalStatus} не найден`);
        }

        statusUpdateData = {
          status: {
            connect: { id: status.id }
          }
        };
      }

      let cellUpdateData = {};

      const cellsToUpdate: string[] = [];
      if (updateCellRentalDto.cellId) {
        cellsToUpdate.push(updateCellRentalDto.cellId);
      }
      if (updateCellRentalDto.cellIds) {
        cellsToUpdate.push(...updateCellRentalDto.cellIds);
      }

      if (cellsToUpdate.length > 0) {
        const cells = await this.prisma.cells.findMany({
          where: { id: { in: cellsToUpdate } },
        });

        if (cells.length !== cellsToUpdate.length) {
          const foundCellIds = cells.map(c => c.id);
          const missingCellIds = cellsToUpdate.filter(id => !foundCellIds.includes(id));
          throw new NotFoundException(`Ячейки с ID ${missingCellIds.join(', ')} не найдены`);
        }

        const activeRentals = await this.prisma.cellRental.findMany({
          where: {
            cell: {
              some: {
                id: { in: cellsToUpdate }
              }
            },
            status: { is: { statusType: 'ACTIVE' } },
            id: { not: id },
          },
          include: {
            client: true,
            cell: true
          }
        });

        if (activeRentals.length > 0) {
          const currentRental = await this.prisma.cellRental.findUnique({
            where: { id },
            include: { client: true }
          });

          const conflictingRentals = activeRentals.filter(rental =>
            rental.clientId !== currentRental?.clientId
          );

          if (conflictingRentals.length > 0) {
            const occupiedCells = conflictingRentals.flatMap(rental => rental.cell.map(c => c.name));
            throw new BadRequestException(`Ячейки ${occupiedCells.join(', ')} уже арендованы другими клиентами`);
          }
        }

        cellUpdateData = {
          cell: {
            set: [],
            connect: cellsToUpdate.map(id => ({ id }))
          }
        };
      }

      const { cellId, cellIds, clientId, rentalStatus, ...restUpdateData } = updateCellRentalDto;

      const updateData = {
        ...restUpdateData,
        ...clientUpdateData,
        ...statusUpdateData,
        ...cellUpdateData,
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

      if (updateCellRentalDto.rentalStatus !== undefined) {
        if (updateCellRentalDto.rentalStatus === CellRentalStatus.CLOSED) {
          const closeDate = new Date();
          if (!updateData.closedAt) {
            updateData.closedAt = closeDate;
            updateData.endDate = closeDate;
          }
          if (!updateCellRentalDto.endDate) {
            updateData.endDate = closeDate;
          }
        } else {
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
              size: true
            },
          },
          client: true,
          status: true,
        },
      });

      await this.syncCellAndRentalStatuses();

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
    const rental = await this.findOne(id);

    const relatedPayments = await this.prisma.payment.findMany({
      where: { cellRentalId: id }
    });

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

  async findActiveRentalsByClient(clientId: string) {
    this.logger.log(`Fetching active rentals for client id: ${clientId}`, 'CellRentalsService');
    return this.prisma.cellRental.findMany({
      where: {
        clientId,
        status: { is: { statusType: 'ACTIVE' } },
      },
      include: {
        cell: {
          include: {
            container: true,
            size: true,
          },
        },
        status: true,
        payments: {
          select: {
            id: true,
            amount: true,
            cellRental: {
              include: {
                status: true
              }
            },
            createdAt: true,
          },
        },
      },
      orderBy: {
        endDate: 'asc',
      },
    });
  }

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
          },
        },
        status: true,
        payments: {
          select: {
            id: true,
            amount: true,
            description: true,
            rentalDuration: true,
            cellRental: {
              include: {
                status: true
              }
            },
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

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
        cell: true,
        payments: {
          select: {
            id: true,
            amount: true,
            cellRental: {
              select: {
                status: true
              }
            },
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async closeRental(id: string) {
    this.logger.log(`Closing rental with id: ${id}`, 'CellRentalsService');
    const rental = await this.findOne(id);

    await this.calculateAndUpdateRentalStatus(id, CellRentalStatus.CLOSED);

    const closeDate = new Date();

    return this.prisma.cellRental.update({
      where: { id },
      data: {
        closedAt: closeDate,
        endDate: closeDate,
        status: { connect: { statusType: 'CLOSED' } },
      },
      include: {
        cell: true,
        client: true,
        status: true
      },
    });
  }

  async syncCellAndRentalStatuses() {
    this.logger.log('Syncing cell and rental statuses...', 'CellRentalsService');

    return await this.prisma.$transaction(async (prisma) => {
      try {
        // Получаем статусы один раз
        const activeCellStatus = await prisma.cellStatus.findFirst({
          where: { statusType: 'ACTIVE' }
        });

        const closedCellStatus = await prisma.cellStatus.findFirst({
          where: { statusType: 'CLOSED' }
        });

        if (!activeCellStatus || !closedCellStatus) {
          throw new Error('Active or Closed cell status not found');
        }

        // 1. Находим все ячейки с активными арендами (любые кроме CLOSED и EXPIRED)
        const activeRentals = await prisma.cellRental.findMany({
          where: {
            status: {
              is: {
                statusType: {
                  in: ['ACTIVE', 'EXTENDED', 'PAYMENT_SOON', 'EXPIRING_SOON', 'RESERVATION']
                }
              }
            }
          },
          include: {
            cell: {
              select: { id: true }
            }
          }
        });

        const activeCellIds = [...new Set(activeRentals.flatMap(rental =>
          rental.cell.map(c => c.id)
        ))];


        // 2.2. Устанавливаем CLOSED для ячеек без активных аренд
        const allCells = await prisma.cells.findMany({
          select: { id: true }
        });


      } catch (error) {
        this.logger.error(`Failed to sync cell statuses: ${error.message}`, error.stack, 'CellRentalsService');
        throw error;
      }
    });
  }

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
      newStatus = forceStatus;
    } else if (rental.status?.statusType != 'ACTIVE') {
      const now = new Date();
      const endDate = new Date(rental.endDate);
      if (endDate < now && !rental.closedAt) {
        newStatus = CellRentalStatus.EXPIRED;
      } else {
        newStatus = CellRentalStatus.EXTENDED;
      }
    } else {
      const now = new Date();
      const endDate = new Date(rental.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const wasExtended = rental.extensionCount > 0 &&
        rental.lastExtendedAt &&
        new Date(rental.lastExtendedAt).getTime() > now.getTime() - 1000 * 60 * 60 * 24 * 7;

      const isReservation = new Date(rental.startDate).getTime() > now.getTime();

      if (isReservation) {
        newStatus = CellRentalStatus.RESERVATION;
      } else if (daysLeft <= 1) {
        newStatus = CellRentalStatus.EXPIRED;
      } else if (daysLeft <= 3) {
        newStatus = CellRentalStatus.EXPIRING_SOON;
      } else if (daysLeft <= 7) {
        newStatus = CellRentalStatus.PAYMENT_SOON;
      } else if (wasExtended) {
        newStatus = CellRentalStatus.EXTENDED;
      } else {
        newStatus = CellRentalStatus.ACTIVE;
      }
    }

    if (!rental.status || rental.status.statusType !== newStatus) {
      const matchingStatus = await this.prisma.cellStatus.findFirst({
        where: {
          statusType: newStatus
        }
      });

      if (matchingStatus) {
        await this.prisma.cellRental.update({
          where: { id },
          data: {
            statusId: matchingStatus.id,
            // Закрываем аренду только если статус CLOSED
            closedAt: newStatus === CellRentalStatus.CLOSED ? new Date() : rental.closedAt
          }
        });

        this.logger.log(`Rental status for id ${id} updated to ${newStatus}`, 'CellRentalsService');

        // Синхронизируем статусы ячеек
        await this.syncCellAndRentalStatuses();
        return true;
      }

      this.logger.log(`Rental status for id ${id} updated to ${newStatus}`, 'CellRentalsService');
      return true;
    }

    return false;
  }

  async updateRentalStatus(id: string, updateRentalStatusDto: UpdateRentalStatusDto) {
    this.logger.log(`Updating rental status for id: ${id} to ${updateRentalStatusDto.rentalStatus}`, 'CellRentalsService');
    try {
      const rental = await this.findOne(id);

      const updateData: any = {
        rentalStatus: updateRentalStatusDto.rentalStatus,
      };

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
        status: { connect: { statusType: status } },
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
        const correctStatus = await this.prisma.cellStatus.findFirst({
          where: {
            statusType: rental.status?.statusType
          }
        });

        if (correctStatus && rental.statusId !== correctStatus.id) {
          await this.prisma.cellRental.update({
            where: { id: rental.id },
            data: {
              statusId: correctStatus.id
            }
          });

          this.logger.log(`Synced visual status for rental ${rental.id} -> ${correctStatus.name}`, 'CellRentalsService');
          syncedCount++;
        }
      } catch (error) {
        this.logger.error(`Failed to sync visual status for rental ${rental.id}: ${error.message}`, error.stack, 'CellRentalsService');
      }
    }

    this.logger.log(`Synced visual statuses for ${syncedCount} rentals.`, 'CellRentalsService');
    return { syncedCount };
  }

  async extendRental(extendCellRentalDto: ExtendCellRentalDto) {
    const { cellRentalId, amount, description, rentalDuration } = extendCellRentalDto;
    this.logger.log(`Extending rental ${cellRentalId}`, 'CellRentalsService');

    const rental = await this.findOne(cellRentalId);

    if (!rental.client?.userId) {
      this.logger.error(`Rental ${cellRentalId} has no linked client with a user account.`, 'CellRentalsService');
      throw new BadRequestException(`Аренда не привязана к аккаунту пользователя и не может быть продлена автоматически.`);
    }

    this.logger.log(`Creating payment for rental extension: ${cellRentalId}`, 'CellRentalsService');
    const payment = await this.prisma.payment.create({
      data: {
        amount,
        description: description || `Продление аренды ячеек #${rental?.cell?.map(c => c.name).join(', ') || 'неизвестно'}`,
        userId: rental.client.userId,
        cellRentalId,
        rentalDuration: rentalDuration || 30,
      },
    });

    const now = new Date();
    const currentEndDate = new Date(rental.endDate);

    const baseDate = rental.status?.statusType === 'ACTIVE' && currentEndDate > now ? currentEndDate : now;

    const newEndDate = new Date(baseDate);
    newEndDate.setMonth(newEndDate.getMonth() + (rentalDuration || 1));
    newEndDate.setHours(23, 59, 59, 999);

    this.logger.log(`Updating rental ${cellRentalId} with new end date: ${newEndDate}`, 'CellRentalsService');

    const updateData: Prisma.CellRentalUpdateInput = {
      endDate: newEndDate,
      lastExtendedAt: new Date(),
      extensionCount: { increment: 1 },
    };

    if (rental.status?.statusType === 'ACTIVE') {
      updateData.closedAt = null;
      await this.calculateAndUpdateRentalStatus(cellRentalId, CellRentalStatus.ACTIVE);
    }

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

    await this.calculateAndUpdateRentalStatus(cellRentalId, CellRentalStatus.EXTENDED);

    return updatedRental;
  }

  async attachPaymentToRental(paymentId: string, rentalId: string) {
    this.logger.log(`Attaching payment ${paymentId} to rental ${rentalId}`, 'CellRentalsService');

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException(`Платеж с ID ${paymentId} не найден`);
    }

    const rental = await this.findOne(rentalId);

    this.logger.log(`Updating payment ${paymentId} to link with rental ${rentalId}`, 'CellRentalsService');
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        cellRentalId: rentalId,
      },
    });

    await this.recalculateRentalDuration(rentalId);

    await this.calculateAndUpdateRentalStatus(rentalId);

    return this.findOne(rentalId);
  }

  async setCellStatus(cellId: string, statusId: string) {
    this.logger.log(`Setting status ${statusId} for cell ${cellId}`, 'CellRentalsService');
    try {
      const status = await this.prisma.cellStatus.findUnique({
        where: { id: statusId }
      });

      if (!status) {
        throw new NotFoundException(`Статус с ID ${statusId} не найден`);
      }

      return await this.prisma.cellRental.update({
        where: { id: cellId },
        data: { statusId: statusId },
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
      const activeRental = await this.prisma.cellRental.findFirst({
        where: {
          cell: {
            some: {
              id: cellId
            }
          },
          status: { statusType: 'ACTIVE' },
        },
      });

      if (activeRental) {
        throw new BadRequestException(`Невозможно удалить статус у ячейки с ID ${cellId}, так как она находится в активной аренде`);
      }

      return await this.prisma.cellRental.update({
        where: { id: cellId },
        data: { statusId: null },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException(`Ячейка с ID ${cellId} не найдена`);
    }
  }

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
              status: {
                select: {
                  name: true,
                  color: true,
                  statusType: true
                }
              },
              payments: {
                where: { cellRental: { status: { statusType: 'ACTIVE' } } },
                select: {
                  id: true,
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
          if (rental.status && rental.status.statusType) {
            this.logger.warn(
              `Mismatch for rental ${rental.id}, status.statusType=${rental.status.statusType}`,
              'CellRentalsService'
            );
          }

          return {
            id: rental.id,
            startDate: rental.startDate,
            endDate: rental.endDate,
            rentalStatus: rental.status?.statusType,
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

  private _extractRentalPeriodFromDescription(description: string): { value: number; unit: string } {
    const durationMatch = description.match(/(\d+)\s*(мес|дн|день|месяц|год)/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1], 10);
      const unit = durationMatch[2].toLowerCase();
      if (!isNaN(value)) {
        return { value, unit };
      }
    }

    return { value: 1, unit: 'мес' };
  }

  async recalculateRentalDuration(rentalId: string) {

    const rental = await this.findOne(rentalId);

    const allPayments = await this.prisma.payment.findMany({
      where: {
        cellRentalId: rentalId,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    let currentEndDate = new Date(rental.startDate);

    for (let i = 0; i < allPayments.length; i++) {
      const payment = allPayments[i];

      let value: number;
      let unit: string;
      let source: string;

      if (payment.rentalDuration !== null && payment.rentalDuration !== undefined && payment.rentalDuration > 0) {
        value = payment.rentalDuration;
        unit = 'дн';
        source = 'rentalDuration field';
      } else {
        const period = this._extractRentalPeriodFromDescription(payment.description || '');
        value = period.value;
        unit = period.unit;
        source = 'description parsing';
      }

      if (unit.startsWith('мес')) {
        currentEndDate.setMonth(currentEndDate.getMonth() + value);
      } else if (unit.startsWith('год')) {
        currentEndDate.setFullYear(currentEndDate.getFullYear() + value);
      } else if (unit.startsWith('дн')) {
        currentEndDate.setDate(currentEndDate.getDate() + value);
      }
    }

    currentEndDate.setDate(currentEndDate.getDate() - 1);
    currentEndDate.setHours(23, 59, 59, 999);

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

    await this.calculateAndUpdateRentalStatus(rentalId);

    return updatedRental;
  }
}