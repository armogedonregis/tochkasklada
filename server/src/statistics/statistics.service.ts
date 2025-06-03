import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getLocationStatistics(query: {
    locationId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const {
        locationId,
        page = 1,
        limit = 10,
        sortBy = 'totalAmount',
        sortDirection = 'desc',
      } = query;

      const startDate = query.startDate ? new Date(query.startDate) : undefined;
      const endDate = query.endDate ? new Date(query.endDate) : undefined;

      const skip = (page - 1) * limit;

      // Базовые условия для фильтрации платежей
      const paymentWhere: Prisma.PaymentWhereInput = {
        status: true, // Только успешные платежи
        cellRental: {
          isActive: true, // Только активные аренды
        },
      };

      // Добавляем фильтр по датам, если они указаны
      if (startDate || endDate) {
        paymentWhere.createdAt = {};
        if (startDate) paymentWhere.createdAt.gte = startDate;
        if (endDate) paymentWhere.createdAt.lte = endDate;
      }

      // Условия для фильтрации по локации
      const locationWhere: Prisma.LocationWhereInput = {};
      if (locationId) {
        locationWhere.id = locationId;
      }

      // Получаем локации с агрегированными данными
      const locations = await this.prisma.location.findMany({
        where: locationWhere,
        select: {
          id: true,
          name: true,
          short_name: true,
          city: {
            select: {
              title: true,
              short_name: true,
            },
          },
          containers: {
            select: {
              cells: {
                select: {
                  rentals: {
                    where: {
                      isActive: true,
                    },
                    select: {
                      payments: {
                        where: paymentWhere,
                        select: {
                          amount: true,
                          createdAt: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        skip,
        take: limit,
      });

      // Формируем статистику для каждой локации
      const statistics = locations.map((location) => {
        let totalPayments = 0;
        let totalAmount = 0;
        let lastPaymentDate: Date | null = null;
        let activeRentals = 0;

        location.containers.forEach((container) => {
          container.cells.forEach((cell) => {
            cell.rentals.forEach((rental) => {
              activeRentals++;
              rental.payments.forEach((payment) => {
                totalPayments++;
                totalAmount += payment.amount;
                if (!lastPaymentDate || payment.createdAt > lastPaymentDate) {
                  lastPaymentDate = payment.createdAt;
                }
              });
            });
          });
        });

        return {
          locationId: location.id,
          locationName: location.name,
          locationShortName: location.short_name,
          cityName: location.city.title,
          cityShortName: location.city.short_name,
          totalPayments,
          totalAmount,
          activeRentals,
          averagePayment: totalPayments > 0 ? totalAmount / totalPayments : 0,
          lastPaymentDate,
          revenuePerRental: activeRentals > 0 ? totalAmount / activeRentals : 0,
        };
      });

      // Сортируем результаты
      statistics.sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        return a[sortBy] > b[sortBy] ? direction * 1 : direction * -1;
      });

      // Получаем общее количество локаций для пагинации
      const totalCount = await this.prisma.location.count({
        where: locationWhere,
      });

      return {
        data: statistics,
        meta: {
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Ошибка при получении статистики: ${error.message}`,
      );
    }
  }

  // Детальная статистика по конкретной локации
  async getLocationDetails(locationId: string, query: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      const { page = 1, limit = 10, startDate, endDate } = query;
      const skip = (page - 1) * limit;

      // Получаем информацию о локации
      const location = await this.prisma.location.findUnique({
        where: { id: locationId },
        select: {
          id: true,
          name: true,
          short_name: true,
          city: true,
        },
      });

      if (!location) {
        throw new Error('Локация не найдена');
      }

      // Условия для фильтрации платежей
      const paymentWhere: Prisma.PaymentWhereInput = {
        status: true,
        cellRental: {
          isActive: true,
          cell: {
            container: {
              locId: locationId,
            },
          },
        },
      };

      if (startDate || endDate) {
        paymentWhere.createdAt = {};
        if (startDate) paymentWhere.createdAt.gte = startDate;
        if (endDate) paymentWhere.createdAt.lte = endDate;
      }

      // Получаем платежи для локации
      const payments = await this.prisma.payment.findMany({
        where: paymentWhere,
        select: {
          id: true,
          amount: true,
          createdAt: true,
          cellRental: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              cell: {
                select: {
                  id: true,
                  name: true,
                  container: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              client: {
                select: {
                  id: true,
                  name: true,
                  user: {
                    select: {
                      id: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      // Общее количество платежей для пагинации
      const totalCount = await this.prisma.payment.count({
        where: paymentWhere,
      });

      // Агрегированные данные
      const aggregated = await this.prisma.payment.aggregate({
        where: paymentWhere,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      return {
        location,
        payments,
        totalAmount: aggregated._sum.amount || 0,
        totalPayments: aggregated._count.id || 0,
        meta: {
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Ошибка при получении детальной статистики: ${error.message}`,
      );
    }
  }
}