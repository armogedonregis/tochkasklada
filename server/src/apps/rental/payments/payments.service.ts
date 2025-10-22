import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateAdminPaymentDto, UpdatePaymentDto, FindPaymentsDto, PaymentSortField, SortDirection } from './dto';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CellRentalsService } from '../cell-rentals/cell-rentals.service';
import { RolesService } from '@/apps/roles/roles.service';
import { TBankService } from '@/integration/tbank/tbank.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly cellRentalsService: CellRentalsService,
    private readonly rolesService: RolesService,
    private readonly tbankService: TBankService,
  ) {
    this.logger.debug?.('PaymentsService instantiated', PaymentsService.name);
  }
  async getPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            client: {
              include: {
                phones: true
              }
            },
          },
        },
        cellRental: {
          include: {
            cell: {
              include: {
                container: true,
                size: true
              }
            }
          }
        }
      },
    });

    if (!payment) {
      return null;
    }

    return payment;
  }

  async getPaymentByOrderId(orderId: string, user: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            client: {
              include: {
                phones: true
              }
            },
          },
        },
        cellRental: {
          include: {
            cell: {
              include: {
                container: true,
                size: true
              }
            }
          }
        }
      },
    });

    if (!payment) {
      return null;
    }

    if (payment && (user.role === 'ADMIN' || payment.userId === user.id)) {
      return payment;
    }

    return { success: false, message: 'Платеж не найден или у вас нет доступа' };
  }

  async createPayment(data: {
    amount: number;
    description?: string;
    userId: string;
  }) {

    const orderId = uuidv4();

    const payment = await this.prisma.payment.create({
      data: {
        amount: data.amount,
        orderId,
        description: data.description,
        userId: data.userId,
      }
    });

    const paymentResult = await this.tbankService.createPayment(
      orderId,
      data.amount,
      data.description
    );

    if (paymentResult.Success && paymentResult.PaymentURL) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentUrl: paymentResult.PaymentURL,
          bankPaymentId: paymentResult.PaymentId
        }
      });

      return { ...payment, paymentUrl: paymentResult.PaymentURL };
    } else {
      this.logger.error(
        `TBank payment failed: ${paymentResult.Message}`,
        '',
        PaymentsService.name
      );
      throw new Error(`Payment creation failed: ${paymentResult.Message}`);
    }
  }

  async createPaymentByAdmin(data: CreateAdminPaymentDto) {
    this.logger.log(`=== Creating admin payment ===`, PaymentsService.name);

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      include: {
        client: true
      }
    });

    if (!user) {
      this.logger.error(`User with ID ${data.userId} not found`, '', PaymentsService.name);
      throw new BadRequestException(`Пользователь с ID ${data.userId} не найден`);
    }

    const orderId = uuidv4();
    this.logger.log(`Generated orderId: ${orderId}`, PaymentsService.name);

    const isCellRental = (data.cellId || data.cellIds?.length) && user.client !== null;
    this.logger.log(`Is cell rental payment: ${isCellRental}`, PaymentsService.name);

    let description = data.description;

    this.logger.log('Creating payment record...', PaymentsService.name);
    const payment = await this.prisma.payment.create({
      data: {
        amount: data.amount,
        orderId,
        description: description,
        userId: data.userId,
        bankPaymentId: data.bankPaymentId,
        paymentUrl: data.paymentUrl,
        rentalDuration: data.rentalDuration,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        }
      }
    });
    this.logger.log(`Payment created with ID: ${payment.id}`, PaymentsService.name);

    if (isCellRental && user.client) {
      const cellIdsToProcess = data.cellIds?.length ? data.cellIds : (data.cellId ? [data.cellId] : []);

      this.logger.log(`Processing cell rental for ${cellIdsToProcess.length} cells...`, PaymentsService.name);
      try {
        // const rental = await this._processMultipleCellsRental(
        //   cellIdsToProcess,
        //   user.client.id,
        //   payment.id,
        //   data.description,
        //   data.statusId
        // );

        const updatedPayment = await this.prisma.payment.findUnique({
          where: { id: payment.id },
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            },
            cellRental: {
              include: {
                cell: true
              }
            }
          }
        });

        this.logger.log('=== Admin payment with rental completed ===', PaymentsService.name);
        return updatedPayment;
      } catch (error) {
        this.logger.error(`Error processing rental: ${error.message}`, error.stack, PaymentsService.name);
        return payment;
      }
    }

    this.logger.log('=== Admin payment completed ===', PaymentsService.name);
    return payment;
  }

  // Обновление платежа
  async updatePayment(id: string, data: UpdatePaymentDto) {
    this.logger.log(`=== Updating payment ${id} ===`, PaymentsService.name);
    this.logger.log(`Input data: ${JSON.stringify(data)}`, PaymentsService.name);

    // Проверяем, существует ли платеж
    const existingPayment = await this.getPaymentById(id);

    if (!existingPayment) {
      throw new NotFoundException(`Платеж с ID ${id} не найден`);
    }

    let updateData: any = { ...data };

    // Удаляем поля, которые не являются частью модели платежа
    const {
      cellRentalId, cellId, cellIds, extendRental,
      detachRental, rentalStartDate, rentalEndDate,
      rentalDuration,
      ...paymentData
    } = updateData;

    this.logger.log(`Extracted values - cellId: ${cellId}, cellIds: ${JSON.stringify(cellIds)}, cellRentalId: ${cellRentalId}, extendRental: ${extendRental}`, PaymentsService.name);

    // Обрабатываем действия с арендой
    try {


      // Привязка к существующей аренде
      if (cellRentalId) {
        // Проверяем, существует ли аренда
        const rental = await this.prisma.cellRental.findUnique({
          where: { id: cellRentalId }
        });

        if (!rental) {
          throw new NotFoundException(`Аренда с ID ${cellRentalId} не найдена`);
        }

        // Привязываем платеж к аренде
        await this.prisma.payment.update({
          where: { id },
          data: { cellRentalId }
        });

        // Если меняется пользователь в платеже, обновляем clientId в аренде
        if (data.userId && data.userId !== existingPayment.userId) {
          const newUser = await this.prisma.user.findUnique({
            where: { id: data.userId },
            include: {
              client: true
            }
          });

          if (newUser && newUser.client) {
            await this.prisma.cellRental.update({
              where: { id: cellRentalId },
              data: { clientId: newUser.client.id }
            });

            this.logger.log(`Rental ${cellRentalId} clientId updated to ${newUser.client.id} when linking payment`, PaymentsService.name);
          }
        }

        // Обрабатываем корректировку дат аренды
        const updateRentalData: any = {};

        if (rentalStartDate) {
          updateRentalData.startDate = new Date(rentalStartDate);
        }

        if (rentalEndDate) {
          updateRentalData.endDate = new Date(rentalEndDate);
        }

        // Если нужно продлить аренду
        if (extendRental === true && !rentalEndDate) {
          const newEndDate = new Date(rental.endDate);
          newEndDate.setMonth(newEndDate.getMonth());
          updateRentalData.endDate = newEndDate;
          updateRentalData.lastExtendedAt = new Date();
          updateRentalData.extensionCount = { increment: 1 };
        }

        // Обновляем аренду, если есть изменения
        if (Object.keys(updateRentalData).length > 0) {
          await this.prisma.cellRental.update({
            where: { id: cellRentalId },
            data: updateRentalData
          });

          this.logger.log(`Аренда ${cellRentalId} обновлена`, PaymentsService.name);
        }
      }

      // Создание новой аренды (приоритет над обновлением rentalDuration)
      // Создание новой аренды ИЛИ привязка к существующей
      else if (cellId || cellIds) {
        this.logger.log(`Processing rental creation/update. cellId: ${cellId}, cellIds: ${JSON.stringify(cellIds)}`, PaymentsService.name);

        // Определяем, какого пользователя использовать для создания аренды
        let targetUserId = data.userId || existingPayment.userId;
        let targetClientId: string;

        // Если передается новый userId, используем его
        if (data.userId && data.userId !== existingPayment.userId) {
          targetUserId = data.userId;

          // Получаем информацию о новом пользователе
          const newUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            include: {
              client: true
            }
          });

          if (!newUser) {
            throw new NotFoundException(`Пользователь с ID ${targetUserId} не найден`);
          }

          if (!newUser.client) {
            throw new BadRequestException(`Пользователь с ID ${targetUserId} не является клиентом`);
          }

          targetClientId = newUser.client.id;
          this.logger.log(`Will create/attach rental for new user ${targetUserId} (client: ${newUser.client.name})`, PaymentsService.name);
        } else {
          // Используем существующего пользователя
          const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
              user: {
                include: {
                  client: true
                }
              }
            }
          });

          if (!payment) {
            throw new NotFoundException(`Платеж с ID ${id} не найден`);
          }

          if (!payment.user.client) {
            throw new BadRequestException(`Пользователь платежа не является клиентом`);
          }

          targetClientId = payment.user.client.id;
          this.logger.log(`Will create/attach rental for existing user ${targetUserId} (client: ${payment.user.client.name})`, PaymentsService.name);
        }

        // Определяем какие ячейки нужно обработать
        const cellIdsToProcess = cellIds?.length ? cellIds : (cellId ? [cellId] : []);

        if (cellIdsToProcess.length === 0) {
          throw new BadRequestException('Необходимо указать ID ячеек для создания аренды');
        }

        // ИЩЕМ СУЩЕСТВУЮЩУЮ АКТИВНУЮ АРЕНДУ клиента
        const existingRental = await this.prisma.cellRental.findFirst({
          where: {
            clientId: targetClientId,
            status: {
              statusType: { not: 'CLOSED' }
            }
          },
          include: {
            cell: true
          }
        });

        let rentalId;

        if (existingRental) {
          // ПРИВЯЗЫВАЕМ к существующей аренде
          rentalId = existingRental.id;

          const currentCellIds = existingRental.cell.map(c => c.id);
          const allCellIds = [...new Set([...currentCellIds, ...cellIdsToProcess])];

          // Обновляем ячейки аренды
          await this.prisma.cellRental.update({
            where: { id: rentalId },
            data: {
              cell: {
                set: allCellIds.map(id => ({ id }))
              }
            }
          });

          this.logger.log(`Updated existing rental ${rentalId} with cells: ${allCellIds.join(', ')}`, PaymentsService.name);
        } else {
          // СОЗДАЕМ новую аренду
          const rental = await this.cellRentalsService.create({
            clientId: targetClientId,
            cellIds: cellIdsToProcess as any,
            startDate: data.rentalStartDate ? new Date(data.rentalStartDate) : new Date() as any,
            endDate: data.rentalEndDate ? new Date(data.rentalEndDate) : this._calculateEndDate(data.rentalDuration) as any
          });

          rentalId = rental.id;
          this.logger.log(`Created new rental ${rentalId} for cells ${cellIdsToProcess.join(', ')}`, PaymentsService.name);
        }

        // ПРИВЯЗЫВАЕМ платеж к аренде
        await this.prisma.payment.update({
          where: { id },
          data: { cellRentalId: rentalId }
        });

        this.logger.log(`Payment ${id} attached to rental ${rentalId}`, PaymentsService.name);
      }


      // Обновление rentalDuration у существующей аренды
      else if (rentalDuration && existingPayment.cellRentalId) {
        const rental = await this.prisma.cellRental.findUnique({
          where: { id: existingPayment.cellRentalId },
        });

        if (rental) {
          const newEndDate = new Date(rental.startDate);
          newEndDate.setDate(newEndDate.getDate() + rentalDuration);

          await this.prisma.cellRental.update({
            where: { id: existingPayment.cellRentalId },
            data: { endDate: newEndDate },
          });

          this.logger.log(`Срок аренды ${existingPayment.cellRentalId} обновлен. Новая дата окончания: ${newEndDate}`, PaymentsService.name);
        }
      }

      // Обновление дат существующей аренды, связанной с платежом
      else if ((rentalStartDate || rentalEndDate) && existingPayment.cellRentalId) {
        const updateRentalData: any = {};

        if (rentalStartDate) {
          updateRentalData.startDate = new Date(rentalStartDate);
        }

        if (rentalEndDate) {
          updateRentalData.endDate = new Date(rentalEndDate);
        }

        if (Object.keys(updateRentalData).length > 0) {
          await this.prisma.cellRental.update({
            where: { id: existingPayment.cellRentalId },
            data: updateRentalData
          });

          this.logger.log(`Аренда ${existingPayment.cellRentalId} обновлена`, PaymentsService.name);
        }
      }
    } catch (error) {
      this.logger.error(`Ошибка при обработке аренды: ${error.message}`, error.stack, PaymentsService.name);
      // Продолжаем обновление платежа даже при ошибке с арендой
    }

    // Обрабатываем обновление пользователя в платеже
    if (data.userId && data.userId !== existingPayment.userId) {
      this.logger.log(`Updating user in payment ${id} from ${existingPayment.userId} to ${data.userId}`, PaymentsService.name);

      // Проверяем, существует ли новый пользователь
      const newUser = await this.prisma.user.findUnique({
        where: { id: data.userId },
        include: {
          client: true
        }
      });

      if (!newUser) {
        throw new NotFoundException(`Пользователь с ID ${data.userId} не найден`);
      }

      // Проверяем, что новый пользователь является клиентом
      if (!newUser.client) {
        throw new BadRequestException(`Пользователь с ID ${data.userId} не является клиентом`);
      }

      this.logger.log(`Payment ${id} will be updated to user ${data.userId} (client: ${newUser.client.name})`, PaymentsService.name);

      // Если платеж привязан к аренде, обновляем clientId в аренде
      if (existingPayment.cellRentalId) {
        this.logger.log(`Payment ${id} is linked to rental ${existingPayment.cellRentalId}, updating clientId in rental`, PaymentsService.name);

        try {
          await this.prisma.cellRental.update({
            where: { id: existingPayment.cellRentalId },
            data: { clientId: newUser.client.id }
          });

          this.logger.log(`Rental ${existingPayment.cellRentalId} clientId updated to ${newUser.client.id}`, PaymentsService.name);
        } catch (rentalError) {
          this.logger.error(`Error updating clientId in rental ${existingPayment.cellRentalId}: ${rentalError.message}`, rentalError.stack, PaymentsService.name);
          // Не прерываем обновление платежа из-за ошибки с арендой
        }
      }
    }

    // Обновляем платеж
    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: { ...paymentData, rentalDuration },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            client: {
              include: {
                phones: true
              }
            }
          }
        },
        cellRental: {
          include: {
            cell: {
              include: {
                container: true,
                size: true,
              }
            }
          }
        }
      }
    });

    // Если платеж привязан к аренде, пересчитываем срок и статус
    if (updatedPayment.cellRentalId) {
      await this.cellRentalsService.recalculateRentalDuration(updatedPayment.cellRentalId);
      await this.cellRentalsService.calculateAndUpdateRentalStatus(updatedPayment.cellRentalId);
    }

    return updatedPayment;
  }

  private _calculateEndDate(rentalDuration?: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + (rentalDuration || 1));
    return date;
  }

  async deletePayment(id: string) {
    const existingPayment = await this.getPaymentById(id);

    if (!existingPayment) {
      throw new NotFoundException(`Платеж с ID ${id} не найден`);
    }

    const { cellRentalId } = existingPayment;

    if (cellRentalId) {
      const rentalPayments = await this.prisma.payment.findMany({
        where: { cellRentalId },
        orderBy: { createdAt: 'desc' }
      });

      if (rentalPayments.length > 0 && rentalPayments[0].id !== id) {
        throw new BadRequestException('Удалить можно только последний платёж аренды');
      }
    }

    await this.prisma.payment.delete({
      where: { id }
    });

    if (cellRentalId) {
      const remainingPayments = await this.prisma.payment.findMany({
        where: { cellRentalId },
        orderBy: { createdAt: 'desc' }
      });
      const remainingPaymentsCount = remainingPayments.length;

      if (remainingPaymentsCount === 0) {
        await this.prisma.cellRental.delete({
          where: { id: cellRentalId }
        });
      } else {
        try {
          await this.cellRentalsService.recalculateRentalDuration(cellRentalId);
        } catch (e) {
          this.logger.error(`Failed to recalc rental ${cellRentalId} after payment delete: ${e.message}`,
            e.stack, PaymentsService.name);
        }
      }
    }

    return { success: true, message: `Платеж ${id} успешно удалён` };
  }

  async handleTinkoffNotification(data: any) {
    try {
      const result = await this.tbankService.handleNotification(data);


      if (result.success) {
        const originalOrderId = data.OrderId.split('_')[0];

        // Обновляем статус в БД
        await this.prisma.payment.update({
          where: { orderId: originalOrderId },
          data: {
            bankPaymentId: data.PaymentId,
          }
        });
      }

      return result;
    } catch (error) {
      return { success: false, message: error.message || 'Внутренняя ошибка сервера' };
    }
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            client: {
              include: {
                phones: true
              }
            }
          }
        },
        cellRental: {
          include: {
            cell: {
              include: {
                container: true,
                size: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllPayments(queryParams: FindPaymentsDto, currentUser?: { id: string; role: string }) {
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = PaymentSortField.CREATED_AT,
        sortDirection = SortDirection.DESC,
        onlyPaid
      } = queryParams;

      let where: any = {};

      if (onlyPaid !== undefined) {
        where.status = String(onlyPaid) === 'true';
      }

      if (search) {
        where.OR = [
          { orderId: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { client: { name: { contains: search, mode: 'insensitive' } } } },
          { user: { client: { phones: { some: { phone: { contains: search, mode: 'insensitive' } } } } } },
          { cellRentalId: { contains: search } }
        ];
      }

      if (currentUser && currentUser.role === 'ADMIN') {
        const adminLocations = await this.rolesService.getAccessibleLocationIdsForAdmin((await this.prisma.admin.findUnique({ where: { userId: currentUser.id }, select: { id: true } }))?.id || '');
        if (adminLocations && adminLocations.length > 0) {
          where.AND = where.AND || [];
          where.AND.push({
            cellRental: {
              cell: {
                some: {
                  container: {
                    location: { id: { in: adminLocations } }
                  }
                }
              }
            }
          });
        } else {
          return {
            data: [],
            meta: { totalCount: 0, page, limit, totalPages: 0 },
          };
        }
      }

      const skip = (page - 1) * limit;

      let orderBy: any = {};

      switch (sortBy) {
        case PaymentSortField.AMOUNT:
          orderBy.amount = sortDirection;
          break;
        case PaymentSortField.STATUS:
          orderBy.status = sortDirection;
          break;
        case PaymentSortField.ORDER_ID:
          orderBy.orderId = sortDirection;
          break;
        case PaymentSortField.CREATED_AT:
        default:
          orderBy.createdAt = sortDirection;
          break;
      }

      const totalCount = await this.prisma.payment.count({ where });

      const payments = await this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              client: {
                include: {
                  phones: true
                }
              }
            }
          },
          cellRental: {
            include: {
              cell: {
                include: {
                  container: {
                    include: {
                      location: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: payments,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при получении списка платежей: ${error.message}`);
    }
  }
} 