import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
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
      // Для endDate добавляем 23:59:59 чтобы включить весь день
      const endDate = query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined;

      const skip = (page - 1) * limit;

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
                    select: {
                      payments: {
                        where: {
                          ...(startDate || endDate ? {
                            createdAt: {
                              ...(startDate ? { gte: startDate } : {}),
                              ...(endDate ? { lte: endDate } : {}),
                            }
                          } : {})
                        },
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
        let totalRentals = 0;

        location.containers.forEach((container) => {
          container.cells.forEach((cell) => {
            cell.rentals.forEach((rental) => {
              // Считаем все аренды
              totalRentals++;
              
              // Считаем активными аренды, которые НЕ в статусе CLOSED
              // if (rental.rentalStatus !== 'CLOSED') {
              //   activeRentals++;
              // }
              
              // Считаем все платежи (независимо от статуса аренды)
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
          totalRentals, // Общее количество аренд
          averagePayment: totalPayments > 0 ? totalAmount / totalPayments : 0,
          lastPaymentDate,
          revenuePerRental: totalRentals > 0 ? totalAmount / totalRentals : 0, // Доход на общее количество аренд
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

  // Получение детальных платежей по локации
  async getLocationPayments(locationId: string, query: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        sortBy = 'createdAt', 
        sortDirection = 'desc' 
      } = query;

      const startDate = query.startDate ? new Date(query.startDate) : undefined;
      // Для endDate добавляем 23:59:59 чтобы включить весь день
      const endDate = query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined;
      const skip = (page - 1) * limit;

      // Условия для фильтрации платежей
      const paymentWhere: Prisma.PaymentWhereInput = {
        cellRental: {
          cell: {
            some: {
              container: {
                locId: locationId,
              },
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
          description: true,
          createdAt: true,
          orderId: true,
          bankPaymentId: true,
          user: {
            select: {
              id: true,
              email: true,
              client: {
                select: {
                  id: true,
                  name: true,
                  phones: {
                    select: {
                      phone: true,
                    },
                  },
                },
              },
            },
          },
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
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip,
        take: limit,
      });

      // Общее количество платежей для пагинации
      const totalCount = await this.prisma.payment.count({
        where: paymentWhere,
      });

      return {
        data: payments,
        meta: {
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Ошибка при получении платежей локации: ${error.message}`,
      );
    }
  }


    // Получение всех платежей (для администратора)
    async getPaymentsByLocations() {
      try {
        // Получаем все локации с агрегированными данными по платежам
        const locationsWithStats = await this.prisma.location.findMany({
          select: {
            id: true,
            name: true,
            short_name: true,
            city: {
              select: {
                title: true,
                short_name: true
              }
            },
            containers: {
              select: {
                cells: {
                  select: {
                    rentals: {
                      select: {
                        payments: {
                          select: {
                            amount: true,
                            createdAt: true
                          }
                        }
                      }
                    }
                  },
                }
              }
            }
          }
        });
  
        // Формируем итоговый результат
        const result = locationsWithStats.map(location => {
          let totalPayments = 0;
          let totalAmount = 0;
          let lastPaymentDate: Date | null = null;
          let activeRentals = 0;
  
          // Проходим по всем контейнерам и ячейкам локации
          location.containers.forEach(container => {
            container.cells.forEach(cell => {
              cell.rentals.forEach(rental => {
                rental.payments.forEach(payment => {
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
            paymentFrequency: totalPayments > 0 ?
              (activeRentals / totalPayments) : 0,
            revenuePerRental: activeRentals > 0 ?
              (totalAmount / activeRentals) : 0
          };
        });
  
        return result;
      } catch (error) {
        throw new InternalServerErrorException(
          `Ошибка при получении статистики по локациям: ${error.message}`
        );
      }
    }
}