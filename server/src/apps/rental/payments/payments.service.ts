import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, PaymentParams } from './utils/generate-token';
import { CreateAdminPaymentDto, UpdatePaymentDto, FindPaymentsDto, PaymentSortField, SortDirection } from './dto';
import { UserRole } from '@prisma/client';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CellRentalsService } from '../cell-rentals/cell-rentals.service';
import { RolesService } from '@/apps/roles/roles.service';
import { RequestsService } from '@/apps/lead-management/requests/requests.service';
import { NormalizeName } from './utils/normalizeName';
import { NormalizeCells } from './utils/normalizeCells';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly cellRentalsService: CellRentalsService,
    private readonly requestsService: RequestsService,
    private readonly rolesService: RolesService,
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

    const paymentResult = await this.createTinkoffPayment(orderId);

    if (paymentResult.success) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { paymentUrl: paymentResult.url }
      });

      return { ...payment, paymentUrl: paymentResult.url };
    } else {
      this.logger.error(`Failed to generate Tinkoff payment: ${paymentResult.message}`, '', PaymentsService.name);
    }

    this.logger.log('=== Payment creation completed ===', PaymentsService.name);
    return payment;
  }

  async createPaymentByAdmin(data: CreateAdminPaymentDto) {
    this.logger.log(`=== Creating admin payment ===`, PaymentsService.name);
    this.logger.log(`User ID: ${data.userId}, Amount: ${data.amount}, Cell ID: ${data.cellId}`, PaymentsService.name);

    this.logger.log('Checking if user exists...', PaymentsService.name);
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
    this.logger.log(`User found: ${user.email}, Client: ${user.client ? 'exists' : 'not exists'}`, PaymentsService.name);

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
        const rental = await this._processMultipleCellsRental(
          cellIdsToProcess,
          user.client.id,
          payment.id,
          data.description,
          data.statusId
        );

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

        if (rental?.id) {
          await this.cellRentalsService.recalculateRentalDuration(rental.id);
          await this.cellRentalsService.calculateAndUpdateRentalStatus(rental.id);
        }

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

  async createTinkoffPayment(orderId: string): Promise<any> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { orderId }
      });

      if (!payment) {
        throw new NotFoundException(`Платеж с orderId ${orderId} не найден`);
      }

      let { amount, description } = payment;

      if (amount < 10) {
        throw new Error(`Сумма платежа должна быть не менее 10 руб.`);
      }

      const terminalKey = process.env.TBANK_TERMINAL_KEY;
      const password = process.env.TBANK_PASSWORD;

      if (!terminalKey || !password) {
        throw new Error('Отсутствуют необходимые учетные данные Tinkoff Bank');
      }

      const tinkoffOrderId = `${orderId}_${uuidv4().slice(0, 8)}`;

      const amountInKopecks = amount * 100;

      const params: PaymentParams = {
        TerminalKey: terminalKey,
        Amount: amountInKopecks,
        OrderId: tinkoffOrderId,
        Description: description || undefined
      };

      const token = generateToken(params, password);

      const response = await fetch('https://securepay.tinkoff.ru/v2/Init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          Token: token
        })
      });

      if (!response.ok) {
        return { success: false, message: 'Ошибка при запросе к Tinkoff Bank' };
      }

      const responseData = await response.json();

      if (responseData && responseData.PaymentURL) {
        if (responseData.PaymentId) {
          await this.prisma.payment.update({
            where: { orderId },
            data: { bankPaymentId: responseData.PaymentId }
          });
        }

        return { success: true, url: responseData.PaymentURL };
      } else {
        return { success: false, message: 'Ошибка получения ссылки на оплату' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'Ошибка при обработке платежа' };
    }
  }

  async handleTinkoffNotification(data: any) {
    try {
      if (!data.OrderId || data.Status === undefined) {
        return { success: false, message: 'Некорректное уведомление' };
      }

      const originalOrderId = data.OrderId.split('_')[0];

      const payment = await this.prisma.payment.findUnique({
        where: { orderId: originalOrderId }
      });

      if (!payment) {
        return { success: false, message: 'Платеж не найден' };
      }

      const isSuccess = data.Status === 'CONFIRMED' || data.Status === 'AUTHORIZED';

      await this.prisma.payment.update({
        where: { orderId: originalOrderId },
        data: {
          bankPaymentId: data.PaymentId || payment.bankPaymentId
        }
      });

      return { success: true, message: `Статус платежа ${originalOrderId} обновлен на ${isSuccess ? 'успешный' : 'неуспешный'}` };
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

  async createTildaPayment(payload: any) {
    this.logger.log(`=== Processing Tilda payment ===`, PaymentsService.name);

    const data = this._normalizeTildaPayload(payload);
    const { email, phone, name, cellNumber, secondCellNumber, sizeform, amount, description, rentalDuration, systranid } = data;

    try {
      if (payload.formname !== 'Cart') {
        this.logger.log(`Creating Request for non-Cart form: ${payload.formname}`, PaymentsService.name);

        let parsedSize: string | undefined;
        let parsedLocation: string | undefined;
        if (typeof sizeform === 'string') {
          const m = sizeform.match(/^\s*([^\s]+)\s+(.+?)\s*$/);
          if (m) {
            parsedSize = m[1];
            parsedLocation = m[2];
          }
        }

        const request = await this.requestsService.createRequest({
          email,
          phone,
          name,
          sizeform: parsedSize,
          location: parsedLocation,
          comment: rentalDuration ? `Срок аренды: ${rentalDuration.value} ${rentalDuration.unit}` : undefined,
        });

        return {
          success: true,
          message: 'Заявка создана',
          request,
          payment: null,
          error: null
        };
      }

      const user = await this._findOrCreateUserWithClient({ email, phone, name, formname: payload.formname });
      if (!user || !user.client) {
        throw new InternalServerErrorException('Не удалось создать или найти пользователя');
      }

      let cell: any | null = null;
      let errorMessage = null;
      let isExtension = false;

      try {
        cell = await this._findAvailableCell(cellNumber, sizeform, user.client.id);

        if (cell && cell.rentals && cell.rentals.length > 0) {
          isExtension = true;
          this.logger.log(`This is a rental extension for cell ${cellNumber}`, PaymentsService.name);
        }
      } catch (cellError) {
        errorMessage = cellError.message;
        this.logger.error(`Cell error: ${cellError.message}`, cellError.stack, PaymentsService.name);
      }

      const paymentDetails = await this._preparePaymentDetails(
        user.id,
        cell,
        amount,
        description,
        {
          cellNumber,
          sizeform,
          rentalDuration,
          systranid
        }
      );

      if (secondCellNumber) {
        paymentDetails.description += `; Доп. ячейка: ${secondCellNumber}`;
      }

      if (errorMessage) {
        paymentDetails.description = `ПРОБЛЕМНЫЙ ПЛАТЕЖ: ${paymentDetails.description} - ${errorMessage}`;
      } else if (isExtension) {
        paymentDetails.description = `${paymentDetails.description}`;
      }

      const payment = await this.createPaymentByAdmin(paymentDetails);

      if (secondCellNumber) {
        try {
          const secondCell = await this._findAvailableCell(secondCellNumber, sizeform, user.client.id);
          const cellIds: string[] = [];
          if (cell?.id) cellIds.push(cell.id);
          if (secondCell?.id) cellIds.push(secondCell.id);

          if (cellIds.length >= 2 && payment) {
            await this._processMultipleCellsRental(
              cellIds,
              user.client.id,
              payment.id,
              paymentDetails.description || undefined,
              paymentDetails.statusId,
              rentalDuration
            );
          }
        } catch (e) {
          this.logger.error(`Failed to process second cell ${secondCellNumber}: ${e.message}`, e.stack, PaymentsService.name);
        }
      }

      return {
        success: !errorMessage,
        message: errorMessage || 'Платеж успешно создан',
        payment,
        error: errorMessage
      };

    } catch (error) {
      this.logger.error(`Failed to process Tilda payment: ${error.message}`, error.stack, PaymentsService.name);
      throw error;
    }
  }

  private _calculateRentalEndDate(startDate: Date, value: number, unit: string): Date {
    const endDate = new Date(startDate);
    const normalizedUnit = unit.toLowerCase().trim();

    if (normalizedUnit.includes('мес') || normalizedUnit.includes('month')) {
      endDate.setMonth(endDate.getMonth() + value);
      endDate.setHours(23, 59, 59, 999);
    }
    else if (normalizedUnit.includes('дн') || normalizedUnit.includes('day')) {
      endDate.setDate(endDate.getDate() + value);
      endDate.setHours(23, 59, 59, 999);
    }
    else if (normalizedUnit.includes('год') || normalizedUnit.includes('year')) {
      endDate.setFullYear(endDate.getFullYear() + value);
      endDate.setHours(23, 59, 59, 999);
    }

    return endDate;
  }

  private _normalizeTildaPayload(payload: any) {
    const context = 'TildaPayload';
    const p = Object.keys(payload).reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = payload[key];
        return acc;
      },
      {} as Record<string, any>,
    );

    const email = p.email;
    const phone = p.phone;
    const name = p.name || '';
    let cellNumber = p.individualnumber;
    let secondCellNumber = p.individualnumber2;

    if (cellNumber) {
      this.logger.log(`Original Tilda cellNumber: ${cellNumber}`, context);
      cellNumber = NormalizeCells(cellNumber);
      this.logger.log(`Normalized Tilda cellNumber: ${cellNumber}`, context);
    }
    if (secondCellNumber) {
      this.logger.log(`Original Tilda second cellNumber: ${secondCellNumber}`, context);
      secondCellNumber = NormalizeCells(secondCellNumber);
      this.logger.log(`Normalized Tilda second cellNumber: ${secondCellNumber}`, context);
    }

    let paymentJson: any = {};
    if (typeof p.payment === 'string') {
      try {
        paymentJson = JSON.parse(p.payment);
      } catch (e) {
        this.logger.error(`Не удалось распарсить поле payment: ${e.message}`, e.stack, context);
      }
    }

    const amount = Number(paymentJson.amount || p.amount || 0);
    if (isNaN(amount) || amount < 0) {
      this.logger.warn(`Invalid amount: ${amount}, setting to 0`, context);
    }

    let sizeform = p.sizeform;
    let rentalDuration: { value: number; unit: string } | undefined;
    let description = '';

    if (Array.isArray(paymentJson.products) && paymentJson.products.length > 0) {
      description = paymentJson.products
        .map((prod: string) => prod.split('=')[0])
        .join('; ');

      const prod = paymentJson.products[0] as string;
      const bracketMatch = prod.match(/\(([^)]+)\)/);
      if (bracketMatch) {
        const parts = bracketMatch[1].split(',').map((s) => s.trim());
        if (!sizeform) {
          sizeform = parts[0];
        }

        const rentalStringPart = parts.find((part) => part.toLowerCase().includes('срок аренды'));
        if (rentalStringPart) {
          const rentalString = rentalStringPart.replace(/срок аренды:/i, '').trim();
          const [value, unit] = rentalString.split(' ');
          const numValue = parseInt(value, 10);

          if (!isNaN(numValue)) {
            rentalDuration = { value: numValue, unit: unit || 'мес' };
            this.logger.log(`Parsed rental duration: ${numValue} ${unit}`, context);
          }
        }
      }
    }

    const systranid = paymentJson.systranid;
    this.logger.log(`Payment systranid: ${systranid}`, context);

    return { email, phone, name, cellNumber, secondCellNumber, sizeform, amount, description, rentalDuration, systranid };
  }

  private async _findOrCreateUserWithClient(data: { email: string; phone?: string; name?: string; formname?: string }) {
    const context = 'TildaUserCreation';
    const { email, phone, name, formname } = data;
    const prettyName = name ? NormalizeName(name) : undefined;

    let user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        client: {
          include: {
            phones: true
          }
        }
      }
    });

    if (user) {
      this.logger.log(`Found existing user by email: ${email}`, context);

      if (user.client) {
        if (phone && !user.client.phones.some(p => p.phone === phone)) {
          await this.prisma.clientPhone.create({
            data: {
              phone,
              clientId: user.client.id
            }
          });
          this.logger.log(`Added new phone ${phone} to existing client`, context);
        }

        if (name && user.client.name?.toLocaleLowerCase('ru-RU') !== name.toLocaleLowerCase('ru-RU')) {
          await this.prisma.client.update({
            where: { id: user.client.id },
            data: { name: prettyName || name }
          });
          this.logger.log(`Updated name for client ${user.client.id}`, context);
        }
      }
    } else {
      user = await this.prisma.user.findFirst({
        where: {
          client: {
            AND: [
              { phones: { some: { phone } } },
              { name: { equals: name || undefined, mode: 'insensitive' } }
            ]
          }
        },
        include: {
          client: {
            include: {
              phones: true
            }
          }
        }
      });

      if (!user) {
        this.logger.log(`Creating new user with email: ${email}`, context);
        user = await this.prisma.user.create({
          data: {
            email,
            password: uuidv4(),
            role: UserRole.CLIENT,
            client: {
              create: {
                name: prettyName || 'Клиент из Tilda',
                phones: {
                  create: phone ? { phone } : undefined
                }
              }
            }
          },
          include: {
            client: {
              include: {
                phones: true
              }
            }
          }
        });
        this.logger.log(`Created new user and client. User ID: ${user.id}`, context);
      }
    }

    return user;
  }

  private async _findAvailableCell(cellNumber?: string, sizeform?: string, clientId?: string): Promise<any | null> {
    const context = 'TildaCellSearch';

    if (cellNumber) {
      this.logger.log(`Searching for cell by number: ${cellNumber}`, context);

      const existingCell = await this.prisma.cells.findFirst({
        where: {
          name: { equals: cellNumber, mode: 'insensitive' }
        },
        include: {
          rentals: {
            include: {
              client: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      }) as any | null;

      if (existingCell) {
        if (existingCell.rentals && existingCell.rentals.length > 0) {
          const rentalClientEmail = existingCell.rentals[0].client?.user?.email;
          const rentalClientId = existingCell.rentals[0].client?.id;
          this.logger.log(`Cell ${cellNumber} is rented. Rental client email: ${rentalClientEmail}, rental clientId: ${rentalClientId}, current clientId: ${clientId}`, context);

          if (clientId && rentalClientId === clientId) {
            this.logger.log(`Cell ${cellNumber} already rented by the same client (clientId: ${clientId}). Will extend rental.`, context);
            return existingCell;
          }
          throw new BadRequestException(`Ячейка ${cellNumber} уже арендована другим клиентом`);
        } else {
          this.logger.log(`Cell found by number: ${existingCell.name} (ID: ${existingCell.id}) - available`, context);
          return existingCell;
        }
      }

      this.logger.warn(`Cell not found by number: ${cellNumber}`, context);
    }

    return null;
  }

  private async _preparePaymentDetails(
    userId: string,
    cell: any,
    amount: number,
    tildaDescription: string,
    tildaInfo: { cellNumber?: string; sizeform?: string; rentalDuration?: { value: number; unit: string }; systranid?: string },
  ): Promise<CreateAdminPaymentDto> {
    const activeStatus = await this.prisma.cellStatus.findFirst({
      where: {
        statusType: 'ACTIVE'
      }
    });

    this.logger.log(`Found active status for Tilda payment: ${activeStatus?.id || 'not found'}`, PaymentsService.name);

    let rentalDurationDays: number | undefined;
    if (tildaInfo.rentalDuration) {
      const { value, unit } = tildaInfo.rentalDuration;
      if (unit.startsWith('мес')) {
        rentalDurationDays = value * 30;
      } else if (unit.startsWith('дн') || unit.startsWith('day')) {
        rentalDurationDays = value;
      } else if (unit.startsWith('год') || unit.startsWith('year')) {
        rentalDurationDays = value * 365;
      }
    }

    const paymentPayload: Partial<CreateAdminPaymentDto> = {
      userId: userId,
      amount: amount > 0 ? amount : 0,
      status: true,
      rentalDuration: rentalDurationDays,
      bankPaymentId: tildaInfo.systranid,
      statusId: activeStatus?.id
    };

    const { cellNumber, sizeform } = tildaInfo;

    let description = tildaDescription || 'Платеж из Tilda';

    if (cellNumber) {
      description += ` (Ячейка: ${cellNumber})`;
    } else if (sizeform) {
      description += ` (Размер: ${sizeform})`;
    }

    if (cell) {
      paymentPayload.cellId = cell.id;
    }

    paymentPayload.description = description;

    return paymentPayload as CreateAdminPaymentDto;
  }

  private async _processMultipleCellsRental(
    cellIds: string[],
    clientId: string,
    paymentId: string,
    description?: string,
    statusId?: string,
    rentalDuration?: { value: number; unit: string }
  ) {
    const uniqueCellIds = Array.from(new Set(cellIds));

    this.logger.log(`Checking if all ${uniqueCellIds.length} cells exist...`, PaymentsService.name);
    const cells = await this.prisma.cells.findMany({
      where: { id: { in: uniqueCellIds } }
    });

    if (cells.length !== uniqueCellIds.length) {
      const foundIds = cells.map(c => c.id);
      const missingIds = uniqueCellIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(`Ячейки не найдены: ${missingIds.join(', ')}`);
    }

    this.logger.log(`Found ${cells.length} cells: ${cells.map(c => c.name).join(', ')}`, PaymentsService.name);

    this.logger.log('Checking for existing active rentals...', PaymentsService.name);
    const activeRentals = await this.prisma.cellRental.findMany({
      where: {
        cell: {
          some: {
            id: { in: uniqueCellIds }
          }
        }
      },
      include: {
        cell: true,
        client: {
          include: {
            user: true
          }
        }
      }
    });

    const conflictingRentals = activeRentals.filter(rental => rental.clientId !== clientId);
    const sameClientRentals = activeRentals.filter(rental => rental.clientId === clientId);

    if (conflictingRentals.length > 0) {
      const conflictingCellNames = conflictingRentals
        .flatMap(rental => rental.cell?.map(c => c.name) || [])
        .join(', ');
      const errorMessage = `Ячейки уже арендованы другими клиентами: ${conflictingCellNames}`;
      this.logger.error(errorMessage, '', PaymentsService.name);
      throw new BadRequestException(errorMessage);
    }

    if (sameClientRentals.length > 0) {
      this.logger.log(`Found ${sameClientRentals.length} existing rentals for the same client.`, PaymentsService.name);

      const alreadyRentedCellIds = sameClientRentals.flatMap(rental =>
        rental.cell?.map(c => c.id) || []
      );

      const newCellIds = uniqueCellIds.filter(id => !alreadyRentedCellIds.includes(id));

      this.logger.log(`Already rented cells: ${alreadyRentedCellIds.length}, New cells to add: ${newCellIds.length}`, PaymentsService.name);

      const latestRental = sameClientRentals.reduce((latest, current) =>
        new Date(current.endDate) > new Date(latest.endDate) ? current : latest
      );

      if (newCellIds.length > 0) {
        this.logger.log(`Adding ${newCellIds.length} new cells to existing rental ${latestRental.id}`, PaymentsService.name);

        await this.prisma.cellRental.update({
          where: { id: latestRental.id },
          data: {
            cell: {
              connect: newCellIds.map(id => ({ id }))
            }
          }
        });
      }

      const newEndDate = rentalDuration
        ? this._calculateRentalEndDate(new Date(latestRental.endDate), rentalDuration.value, rentalDuration.unit)
        : this._calculateRentalEndDate(new Date(latestRental.endDate), 1, 'month');

      const updatedRental = await this.prisma.cellRental.update({
        where: { id: latestRental.id },
        data: {
          endDate: newEndDate,
          lastExtendedAt: new Date(),
          extensionCount: { increment: 1 },
          status: {
            connect: {
              statusType: "ACTIVE"
            }
          }
        }
      });

      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          cellRentalId: updatedRental.id,
          description: description || `Продление аренды ячеек: ${cells.map(c => c.name).join(', ')}`
        }
      });

      this.logger.log(`Payment ${paymentId} linked to updated rental ${updatedRental.id}`, PaymentsService.name);
      return updatedRental;
    }

    try {
      const startDate = new Date();
      const endDate = rentalDuration
        ? this._calculateRentalEndDate(new Date(startDate), rentalDuration.value, rentalDuration.unit)
        : this._calculateRentalEndDate(new Date(startDate), 1, 'month');

      const statuses = await this.prisma.cellStatus.findFirst({
        where: {
          statusType: "ACTIVE"
        }
      })

      if (!statuses) return null;

      const rental = await this.cellRentalsService.create({
        cellIds: uniqueCellIds,
        clientId: clientId,
        statusId: statuses.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          cellRentalId: rental.id,
          description: description || `Аренда ячеек: ${cells.map(c => c.name).join(', ')}`
        }
      });

      this.logger.log(`Payment ${paymentId} linked to rental ${rental.id}`, PaymentsService.name);
      return rental;
    } catch (error) {
      this.logger.error(`Error in _processMultipleCellsRental: ${error.message}`, error.stack, PaymentsService.name);
      throw error;
    }
  }
} 