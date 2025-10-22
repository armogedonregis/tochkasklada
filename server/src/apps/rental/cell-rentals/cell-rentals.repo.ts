import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CellRentalSortField, FindCellRentalsDto, SortDirection } from './dto/find-cell-rentals.dto';
import { Prisma } from '@prisma/client';




@Injectable()
export class CellRentalsRepo {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) {
        this.logger.debug?.('CellRentalsRepo instantiated', CellRentalsRepo.name);
    }

    /**
     * Find Cell Rentals DB
     */
    async findCellRentalsDB(queryParams: FindCellRentalsDto) {
        this.logger.log(`Fetching cell rentals with query: ${JSON.stringify(queryParams)}`, 'CellRentalsService');
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
    }

    /**
     * Метод для поиска существующей ячейки без учета регистра
     * @param cellNumber 01C
     * @returns 
     */
    async findExistingCell(cellNumber: string) {
        return await this.prisma.cells.findFirst({
            where: {
                name: { equals: cellNumber, mode: 'insensitive' }
            },
            include: {
                rentals: {
                    where: {
                        status: {
                            statusType: {
                                not: 'CLOSED'
                            }
                        }
                    },
                    include: {
                        client: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Поиск аренд для уведомления по email
     * @param startDate 
     * @param endDate 
     * @returns 
     */
    async findRentalsForEmailNotifications(startDate: Date, endDate: Date) {
        return await this.prisma.cellRental.findMany({
            where: {
                endDate: {
                    gte: startDate,
                    lte: endDate,
                },
                status: {
                    statusType: {
                        not: 'CLOSED'
                    }
                }
            },
            include: {
                client: {
                    include: {
                        user: true
                    }
                },
                cell: {
                    include: {
                        container: true
                    }
                }
            }
        });
    }
}