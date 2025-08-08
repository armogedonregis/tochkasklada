import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, PaymentParams } from './utils/generate-token';
import { CreateAdminPaymentDto, UpdatePaymentDto, FindPaymentsDto, PaymentSortField, SortDirection } from './dto';
import { Prisma, UserRole } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { CellRentalsService } from '../cell-rentals/cell-rentals.service';
import { ListService } from '../list/list.service';
import { RequestsService } from '../requests/requests.service';

// Добавляем интерфейс на уровне класса
interface CellWithRentals {
    id: string;
    name: string;
    status?: {
        name: string;
        color: string;
    } | null;
    rentals: Array<{
        id: string;
        isActive: boolean;
        client?: {
            user?: {
                email: string;
            } | null;
        } | null;
    }>;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly cellRentalsService: CellRentalsService,
    private readonly listService: ListService,
    private readonly requestsService: RequestsService,
  ) {
    this.logger.debug?.('PaymentsService instantiated', PaymentsService.name);
  }

  // Получение платежа по ID
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

  // Получение платежа по ID заказа
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
                size: true,
                status: true
              }
            }
          }
        }
      },
    });

    if (!payment) {
      return null;
    }

    // Проверяем доступ (админ может видеть любой платеж, пользователь - только свой)
    if (payment && (user.role === 'ADMIN' || payment.userId === user.id)) {
      return payment;
    }

    return { success: false, message: 'Платеж не найден или у вас нет доступа' };
  }

  // Создание платежа пользователем
  async createPayment(data: {
    amount: number;
    description?: string;
    userId: string;
  }) {
    this.logger.log(`=== Creating payment for user ${data.userId} ===`, PaymentsService.name);
    this.logger.log(`Amount: ${data.amount}, Description: ${data.description}`, PaymentsService.name);

    const orderId = uuidv4();
    this.logger.log(`Generated orderId: ${orderId}`, PaymentsService.name);

    // Создаем запись о платеже в базе данных
    this.logger.log('Creating payment record in database...', PaymentsService.name);
    const payment = await this.prisma.payment.create({
      data: {
        amount: data.amount,
        orderId,
        description: data.description,
        userId: data.userId,
        status: false
      }
    });
    this.logger.log(`Payment created with ID: ${payment.id}`, PaymentsService.name);

    // Генерируем ссылку на оплату Tinkoff
    this.logger.log('Generating Tinkoff payment link...', PaymentsService.name);
    const paymentResult = await this.createTinkoffPayment(orderId);

    if (paymentResult.success) {
      this.logger.log(`Tinkoff payment URL generated: ${paymentResult.url}`, PaymentsService.name);
      // Обновляем запись платежа, добавляя URL для оплаты
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { paymentUrl: paymentResult.url }
      });

      this.logger.log('Payment record updated with payment URL', PaymentsService.name);
      return { ...payment, paymentUrl: paymentResult.url };
    } else {
      this.logger.error(`Failed to generate Tinkoff payment: ${paymentResult.message}`, '', PaymentsService.name);
    }

    this.logger.log('=== Payment creation completed ===', PaymentsService.name);
    return payment;
  }

  // Создание платежа администратором
  async createPaymentByAdmin(data: CreateAdminPaymentDto) {
    this.logger.log(`=== Creating admin payment ===`, PaymentsService.name);
    this.logger.log(`User ID: ${data.userId}, Amount: ${data.amount}, Cell ID: ${data.cellId}`, PaymentsService.name);

    // Проверяем, существует ли пользователь
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

    // Создаем orderId
    const orderId = uuidv4();
    this.logger.log(`Generated orderId: ${orderId}`, PaymentsService.name);

    // Проверяем, является ли платеж оплатой за аренду ячейки
    const isCellRental = data.cellId && user.client !== null;
    this.logger.log(`Is cell rental payment: ${isCellRental}`, PaymentsService.name);

    // Определяем описание платежа
    let description = data.description;

    // Создаем платеж с предоставленными данными
    this.logger.log('Creating payment record...', PaymentsService.name);
    const payment = await this.prisma.payment.create({
      data: {
        amount: data.amount,
        orderId,
        description: description,
        userId: data.userId,
        status: data.status || true, // Для админа платеж по умолчанию успешный
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

    // Если это платеж за аренду ячейки, то обрабатываем аренду
    if (isCellRental && user.client) {
      this.logger.log('Processing cell rental...', PaymentsService.name);
      try {
        // Проверяем, существует ли ячейка
        this.logger.log(`Checking if cell ${data.cellId} exists...`, PaymentsService.name);
        const cell = await this.prisma.cells.findUnique({
          where: { id: data.cellId }
        });

        if (!cell) {
          this.logger.error(`Cell with ID ${data.cellId} not found`, '', PaymentsService.name);
          throw new BadRequestException(`Ячейка с ID ${data.cellId} не найдена`);
        }
        this.logger.log(`Cell found: ${cell.name}`, PaymentsService.name);

        // Проверяем, есть ли уже активная аренда для этой ячейки
        this.logger.log('Checking for existing active rental...', PaymentsService.name);
        const existingRental = await this.prisma.cellRental.findFirst({
          where: {
            cellId: data.cellId,
            isActive: true
          }
        });

        // Длительность аренды из платежа или по умолчанию 30 дней
        const rentalDurationDays = data.rentalDuration || 30;
        this.logger.log(`Rental duration: ${rentalDurationDays} days`, PaymentsService.name);

        let rental;

        if (existingRental) {
          this.logger.log(`Existing rental found: ${existingRental.id}`, PaymentsService.name);
          // Ячейка уже арендована
          if (existingRental.clientId === user.client.id) {
            this.logger.log('Extending existing rental for same client...', PaymentsService.name);
            // Аренда принадлежит этому же клиенту - продлеваем ее
            const newEndDate = new Date(existingRental.endDate);
            newEndDate.setDate(newEndDate.getDate() + rentalDurationDays);

            // Обновляем аренду
            rental = await this.prisma.cellRental.update({
              where: { id: existingRental.id },
              data: {
                endDate: newEndDate,
                lastExtendedAt: new Date(),
                extensionCount: { increment: 1 }
              }
            });
            this.logger.log(`Rental extended, new end date: ${newEndDate}`, PaymentsService.name);

            // Связываем платеж с арендой
            await this.prisma.payment.update({
              where: { id: payment.id },
              data: {
                cellRentalId: rental.id,
                description: description || `Продление аренды ячейки №${cell.name} на ${rentalDurationDays} дн.`
              }
            });
            this.logger.log('Payment linked to extended rental', PaymentsService.name);
          } else {
            this.logger.error(`Cell ${cell.name} already rented by another client (clientId: ${existingRental.clientId}, current clientId: ${user.client.id})`, '', PaymentsService.name);
            // Ячейка арендована другим клиентом
            throw new BadRequestException(`Ячейка ${cell.name} уже арендована другим клиентом`);
          }
        } else {
          this.logger.log('Creating new rental...', PaymentsService.name);
          // Создаем новую аренду
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + rentalDurationDays);

          // Проверка cellId перед созданием аренды
          if (!data.cellId) {
            this.logger.error('Cell ID is required for creating rental', '', PaymentsService.name);
            throw new BadRequestException('ID ячейки (cellId) обязателен для создания аренды');
          }

          // Находим активный статус
          const activeStatus = await this.prisma.cellStatus.findFirst({
            where: {
              statusType: 'ACTIVE'
            }
          });

          this.logger.log(`Found active status: ${activeStatus?.id || 'not found'}`, PaymentsService.name);

          rental = await this.prisma.cellRental.create({
            data: {
              cellId: data.cellId,
              clientId: user.client.id,
              startDate,
              endDate,
              isActive: true,
              statusId: activeStatus?.id || data.statusId // Используем найденный активный статус или переданный в data
            }
          });
          this.logger.log(`New rental created: ${rental.id}, start: ${startDate}, end: ${endDate}`, PaymentsService.name);

          // Связываем платеж с арендой и обновляем описание
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
              cellRentalId: rental.id,
              description: description || `Аренда ячейки #${cell.name} на ${rentalDurationDays} дн.`
            }
          });
          this.logger.log('Payment linked to new rental', PaymentsService.name);
        }

        // Получаем обновленный платеж с информацией об аренде
        const updatedPayment = await this.prisma.payment.findUnique({
          where: { id: payment.id },
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            },
            cellRental: true
          }
        });

        // Если платеж привязан к аренде, пересчитываем срок и статус
        if (rental?.id) {
          await this.cellRentalsService.recalculateRentalDuration(rental.id);
          await this.cellRentalsService.updateRentalStatus(rental.id);
        }

        this.logger.log('=== Admin payment with rental completed ===', PaymentsService.name);
        return updatedPayment;
      } catch (error) {
        // Если произошла ошибка при создании аренды, все равно возвращаем созданный платеж
        this.logger.error(`Error processing rental: ${error.message}`, error.stack, PaymentsService.name);
        return payment;
      }
    }

    this.logger.log('=== Admin payment completed ===', PaymentsService.name);
    return payment;
  }

  // Обновление платежа
  async updatePayment(id: string, data: UpdatePaymentDto) {
    // Проверяем, существует ли платеж
    const existingPayment = await this.getPaymentById(id);

    if (!existingPayment) {
      throw new NotFoundException(`Платеж с ID ${id} не найден`);
    }

    let updateData: any = { ...data };

    // Удаляем поля, которые не являются частью модели платежа
    const {
      cellRentalId, cellId, extendRental,
      detachRental, rentalStartDate, rentalEndDate,
      rentalDuration,
      ...paymentData
    } = updateData;

    // Обрабатываем действия с арендой
    try {
      // Отвязка от аренды
      if (detachRental === true) {
        // Проверяем, привязан ли платеж к аренде
        if (existingPayment.cellRentalId) {
          await this.prisma.payment.update({
            where: { id },
            data: { cellRentalId: null }
          });
          this.logger.log(`Платеж ${id} отвязан от аренды ${existingPayment.cellRentalId}`, PaymentsService.name);
        }
      }

      // Привязка к существующей аренде
      else if (cellRentalId) {
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
          newEndDate.setMonth(newEndDate.getMonth() + 1);
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

      // Создание новой аренды
      else if (cellId) {
        // Получаем информацию о пользователе
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

        // Проверяем, существует ли ячейка
        const cell = await this.prisma.cells.findUnique({
          where: { id: cellId }
        });

        if (!cell) {
          throw new BadRequestException(`Ячейка с ID ${cellId} не найдена`);
        }

        // Проверяем, не арендована ли уже ячейка другим клиентом
        const existingRental = await this.prisma.cellRental.findFirst({
          where: {
            cellId,
            isActive: true
          },
          include: {
            client: true
          }
        });

        if (existingRental) {
          // Если аренда принадлежит другому клиенту, запрещаем
          if (existingRental.clientId !== payment.user.client.id) {
            throw new BadRequestException(`Ячейка ${cell.name} уже арендована другим клиентом`);
          }
          // Если аренда принадлежит тому же клиенту, разрешаем создание новой аренды
        }

        // Определяем даты начала и окончания аренды
        let startDate = rentalStartDate ? new Date(rentalStartDate) : new Date();
        let endDate: Date;

        if (rentalEndDate) {
          endDate = new Date(rentalEndDate);
        } else {
          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
        }

        // Создаем новую аренду
        const rental = await this.prisma.cellRental.create({
          data: {
            cellId,
            clientId: payment.user.client.id,
            startDate,
            endDate,
            isActive: true
          }
        });

        // Привязываем платеж к новой аренде
        await this.prisma.payment.update({
          where: { id },
          data: {
            cellRentalId: rental.id,
            description: paymentData.description || `Аренда ячейки #${cell.name}`
          }
        });

        this.logger.log(`Создана новая аренда ${rental.id} для ячейки ${cellId}`, PaymentsService.name);
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
                status: true
              }
            }
          }
        }
      }
    });

    // Если платеж привязан к аренде, пересчитываем срок и статус
    if (updatedPayment.cellRentalId) {
      await this.cellRentalsService.recalculateRentalDuration(updatedPayment.cellRentalId);
      await this.cellRentalsService.updateRentalStatus(updatedPayment.cellRentalId);
    }

    return updatedPayment;
  }

  // Установка статуса платежа
  async setPaymentStatus(id: string, status: boolean) {
    // Проверяем, существует ли платеж
    const existingPayment = await this.getPaymentById(id);

    if (!existingPayment) {
      throw new NotFoundException(`Платеж с ID ${id} не найден`);
    }

    // Обновляем статус платежа
    return this.prisma.payment.update({
      where: { id },
      data: { status },
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
      }
    });
  }

  // Удаление платежа
  async deletePayment(id: string) {
    // Проверяем, существует ли платеж
    const existingPayment = await this.getPaymentById(id);

    if (!existingPayment) {
      throw new NotFoundException(`Платеж с ID ${id} не найден`);
    }

    // Если платеж привязан к аренде, выполняем дополнительные проверки
    const { cellRentalId } = existingPayment;

    if (cellRentalId) {
      // Находим все платежи аренды, отсортированные по дате создания (последний – первый)
      const rentalPayments = await this.prisma.payment.findMany({
        where: { cellRentalId },
        orderBy: { createdAt: 'desc' }
      });

      // Проверяем, является ли удаляемый платеж последним
      if (rentalPayments.length > 0 && rentalPayments[0].id !== id) {
        throw new BadRequestException('Удалить можно только последний платёж аренды');
      }
    }

    // Удаляем платеж
    await this.prisma.payment.delete({
      where: { id }
    });

    // Если у платежа была привязка к аренде – проверяем, остались ли ещё платежи
    if (cellRentalId) {
      const remainingPayments = await this.prisma.payment.findMany({
        where: { cellRentalId },
        orderBy: { createdAt: 'desc' }
      });
      const remainingPaymentsCount = remainingPayments.length;

      if (remainingPaymentsCount === 0) {
        // Если платежей не осталось – удаляем аренду
        await this.prisma.cellRental.delete({
          where: { id: cellRentalId }
        });
      } else {
        // Если остались другие платежи – откатываем срок аренды
        const rental = await this.prisma.cellRental.findUnique({
          where: { id: cellRentalId }
        });
        if (rental) {
          // Откатываем на то количество дней, которое было в удаленном платеже
          const daysToSubtract = existingPayment.rentalDuration || 30; // 30 как fallback
          const newEndDate = new Date(rental.endDate);
          newEndDate.setDate(newEndDate.getDate() - daysToSubtract);
          await this.prisma.cellRental.update({
            where: { id: cellRentalId },
            data: { endDate: newEndDate }
          });
        }
      }
    }

    return { success: true, message: `Платеж ${id} успешно удалён` };
  }

  // Создание платежа в Tinkoff Bank
  async createTinkoffPayment(orderId: string): Promise<any> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { orderId }
      });

      if (!payment) {
        throw new NotFoundException(`Платеж с orderId ${orderId} не найден`);
      }

      let { amount, description } = payment;

      // Проверяем минимальную сумму (10 рублей)
      if (amount < 10) {
        throw new Error(`Сумма платежа должна быть не менее 10 руб.`);
      }

      const terminalKey = process.env.TBANK_TERMINAL_KEY;
      const password = process.env.TBANK_PASSWORD;

      if (!terminalKey || !password) {
        throw new Error('Отсутствуют необходимые учетные данные Tinkoff Bank');
      }

      // Формируем уникальный ID заказа для Tinkoff
      const tinkoffOrderId = `${orderId}_${uuidv4().slice(0, 8)}`;

      // Конвертируем сумму из рублей в копейки для Tinkoff API
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
        // Сохраняем ID платежа от банка, если он есть
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

  // Обработка уведомления от Tinkoff Bank
  async handleTinkoffNotification(data: any) {
    try {
      // Проверка наличия необходимых полей
      if (!data.OrderId || data.Status === undefined) {
        return { success: false, message: 'Некорректное уведомление' };
      }
      
      // Извлекаем оригинальный orderId из Tinkoff OrderId (убираем суффикс)
      const originalOrderId = data.OrderId.split('_')[0];
      
      // Получаем платеж из базы напрямую, минуя собственный метод с проверками
      const payment = await this.prisma.payment.findUnique({
        where: { orderId: originalOrderId }
      });
      
      if (!payment) {
        return { success: false, message: 'Платеж не найден' };
      }
      
      // Обновляем статус платежа
      const isSuccess = data.Status === 'CONFIRMED' || data.Status === 'AUTHORIZED';
      
      await this.prisma.payment.update({
        where: { orderId: originalOrderId },
        data: { 
          status: isSuccess,
          bankPaymentId: data.PaymentId || payment.bankPaymentId
        }
      });
      
      return { success: true, message: `Статус платежа ${originalOrderId} обновлен на ${isSuccess ? 'успешный' : 'неуспешный'}` };
    } catch (error) {
      return { success: false, message: error.message || 'Внутренняя ошибка сервера' };
    }
  }

  // Получение списка платежей пользователя
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
                size: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Получение всех платежей (для администратора)
  async getAllPayments(queryParams: FindPaymentsDto) {
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = PaymentSortField.CREATED_AT,
        sortDirection = SortDirection.DESC,
        onlyPaid
      } = queryParams;

      // Базовые условия фильтрации
      let where: any = {};

      // Дополнительный фильтр по статусу оплаты, если указан
      if (onlyPaid !== undefined) {
        where.status = onlyPaid;
      }

      // Если указана поисковая строка, строим сложное условие для поиска
      if (search) {
        where.OR = [
          { orderId: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { client: { name: { contains: search, mode: 'insensitive' } } } },
          { user: { client: { phones: { some: { phone: { contains: search, mode: 'insensitive' } } } } } },
          // Поиск по ID связанной аренды ячейки
          { cellRentalId: { contains: search } }
        ];
      }

      // Вычисляем параметры пагинации
      const skip = (page - 1) * limit;

      // Настройка сортировки
      let orderBy: any = {};

      // В зависимости от выбранного поля сортировки
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

      // Запрос на получение общего количества
      const totalCount = await this.prisma.payment.count({ where });

      // Запрос на получение данных с пагинацией
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

      // Рассчитываем количество страниц
      const totalPages = Math.ceil(totalCount / limit);

      // Возвращаем результат с мета-информацией
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
                    where: {
                      isActive: true // Только активные аренды
                    },
                    select: {
                      isActive: true,
                      payments: {
                        where: {
                          status: true // Только успешные платежи
                        },
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
              activeRentals += rental.isActive ? 1 : 0;
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
          // Дополнительные метрики, которые могут быть полезны:
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

  async createTildaPayment(payload: any) {
    this.logger.log(`=== Processing Tilda payment ===`, PaymentsService.name);
    
    const data = this._normalizeTildaPayload(payload);
    const { email, phone, name, cellNumber, sizeform, amount, description, rentalDurationDays, systranid } = data;
    
    try {
        // Если форма не Cart, создаем заявку (Request)
        if (payload.formname !== 'Cart') {
            this.logger.log(`Creating Request for non-Cart form: ${payload.formname}`, PaymentsService.name);

            const request = await this.requestsService.createRequest({
                email,
                phone,
                name,
                description: description + 'размер ячейки:' + sizeform + 'срок аренды:' + rentalDurationDays,
            });

            return {
                success: true,
                message: 'Заявка создана',
                request,
                payment: null,
                error: null
            };
        }

        // Для Cart формы - создаем пользователя и клиента как раньше
        const user = await this._findOrCreateUserWithClient({ email, phone, name, formname: payload.formname });
        if (!user || !user.client) {
            throw new InternalServerErrorException('Не удалось создать или найти пользователя');
        }

        // Дальше обрабатываем только платежи из Cart формы
        let cell: CellWithRentals | null = null;
        let errorMessage = null;
        let isExtension = false;
        
        try {
            cell = await this._findAvailableCell(cellNumber, sizeform, email);
            
            // Проверяем, является ли это продлением аренды
            if (cell && cell.rentals && cell.rentals.length > 0) {
                isExtension = true;
                this.logger.log(`This is a rental extension for cell ${cellNumber}`, PaymentsService.name);
            }
        } catch (cellError) {
            errorMessage = cellError.message;
            this.logger.error(`Cell error: ${cellError.message}`, cellError.stack, PaymentsService.name);
        }

        // Готовим данные платежа
        const paymentDetails = await this._preparePaymentDetails(
            user.id,
            cell,
            amount,
            description,
            {
                cellNumber,
                sizeform,
                rentalDurationDays,
                systranid
            }
        );

        // Если была ошибка с ячейкой, добавляем пометку в описание
        if (errorMessage) {
            paymentDetails.description = `ПРОБЛЕМНЫЙ ПЛАТЕЖ: ${paymentDetails.description} - ${errorMessage}`;
        } else if (isExtension) {
            // Если это продление аренды, добавляем соответствующую пометку
            paymentDetails.description = `ПРОДЛЕНИЕ АРЕНДЫ: ${paymentDetails.description}`;
        }

        // Создаем платеж
        const payment = await this.createPaymentByAdmin(paymentDetails);

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

  /**
   * Нормализует ключи в payload от Tilda и извлекает основные данные.
   */
  private _normalizeTildaPayload(payload: any) {
    const context = 'TildaPayload';
    // Приводим все ключи к нижнему регистру для удобства
    const p = Object.keys(payload).reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = payload[key];
        return acc;
      },
      {} as Record<string, any>,
    );

    // Основные поля
    const email = p.email;
    const phone = p.phone;
    const name = p.name || 'Клиент из Tilda';
    let cellNumber = p.individualnumber;

    // Хардкод для обработки пользовательского ввода номера ячейки
    if (cellNumber) {
        this.logger.log(`Original Tilda cellNumber: ${cellNumber}`, context);
        cellNumber = String(cellNumber)
            .toUpperCase()
            .replace(/А/g, 'A')
            .replace(/В/g, 'B')
            .replace(/С/g, 'C')
            .replace(/Е/g, 'E');
        this.logger.log(`Normalized Tilda cellNumber: ${cellNumber}`, context);
    }

    // Поля из JSON-строки 'payment'
    let paymentJson: any = {};
    if (typeof p.payment === 'string') {
        try {
            paymentJson = JSON.parse(p.payment);
        } catch (e) {
            this.logger.error(`Не удалось распарсить поле payment: ${e.message}`, e.stack, context);
        }
    }

    // Сумма
    const amount = Number(paymentJson.amount || p.amount || 0);
    if (isNaN(amount) || amount < 0) {
        this.logger.warn(`Invalid amount: ${amount}, setting to 0`, context);
    }

    // Размер (sizeform) и срок аренды
    let sizeform = p.sizeform;
    let rentalDurationDays: number | undefined;
    let description = '';

    if (Array.isArray(paymentJson.products) && paymentJson.products.length > 0) {
        description = paymentJson.products
            .map((prod: string) => prod.split('=')[0])
            .join('; ');

        // Парсим sizeform и срок аренды из первого продукта
        const prod = paymentJson.products[0] as string;
        const bracketMatch = prod.match(/\(([^)]+)\)/); // e.g. (XS-1-shu, Срок аренды: 1 месяц)
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

                //** переработать логику а то вместо 365дн получается 360 */
                if (!isNaN(numValue)) {
                    if (unit.startsWith('мес')) {
                        rentalDurationDays = numValue * 30;
                    } else if (unit.startsWith('дн') || unit.startsWith('day')) {
                        rentalDurationDays = numValue;
                    } else if (unit.startsWith('год') || unit.startsWith('year')) {
                        rentalDurationDays = numValue * 365;
                    }
                }
            }
        }
    }

    // Получаем systranid из объекта payment
    const systranid = paymentJson.systranid;
    this.logger.log(`Payment systranid: ${systranid}`, context);

    return { email, phone, name, cellNumber, sizeform, amount, description, rentalDurationDays, systranid };
  }

  /**
   * Находит или создает пользователя и связанного с ним клиента.
   */
  private async _findOrCreateUserWithClient(data: { email: string; phone?: string; name?: string; formname?: string }) {
    const context = 'TildaUserCreation';
    const { email, phone, name, formname } = data;

    // Сначала ищем точно по email
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
      
      // Обновляем дополнительные данные если нужно
      if (user.client) {
        // Добавляем новый телефон, если его нет
        if (phone && !user.client.phones.some(p => p.phone === phone)) {
          await this.prisma.clientPhone.create({
            data: {
              phone,
              clientId: user.client.id
            }
          });
          this.logger.log(`Added new phone ${phone} to existing client`, context);
        }

        // Обновляем имя, если оно отличается
        if (name && user.client.name !== name) {
          await this.prisma.client.update({
            where: { id: user.client.id },
            data: { name }
          });
          this.logger.log(`Updated name for client ${user.client.id}`, context);
        }
      }
    } else {
      // Если по email не нашли, ищем по телефону и имени
      user = await this.prisma.user.findFirst({
        where: {
          client: {
            AND: [
              { phones: { some: { phone } } },
              { name }
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
        // Создаем нового только если вообще не нашли
        this.logger.log(`Creating new user with email: ${email}`, context);
        user = await this.prisma.user.create({
          data: {
            email,
            password: uuidv4(),
            role: UserRole.CLIENT,
            client: {
              create: {
                name: name || 'Клиент из Tilda',
                isActive: formname === 'Cart',
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

  /**
   * Ищет доступную ячейку сначала по номеру, потом по размеру/локации.
   */
  private async _findAvailableCell(cellNumber?: string, sizeform?: string, email?: string): Promise<CellWithRentals | null> {
    const context = 'TildaCellSearch';
    
    if (cellNumber) {
        this.logger.log(`Searching for cell by number: ${cellNumber}`, context);
        
        // Ищем ячейку по номеру
        const existingCell = await this.prisma.cells.findFirst({
            where: {
                name: { equals: cellNumber, mode: 'insensitive' }
            },
            include: {
                status: true,
                rentals: {
                    where: { isActive: true },
                    include: {
                        client: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        }) as CellWithRentals | null;

        if (existingCell) {
            // Ячейка существует
            if (existingCell.rentals && existingCell.rentals.length > 0) {
                // Ячейка уже арендована - проверяем, принадлежит ли аренда текущему клиенту
                const rentalClientEmail = existingCell.rentals[0].client?.user?.email;
                this.logger.log(`Cell ${cellNumber} is rented. Rental client email: ${rentalClientEmail}, current email: ${email}`, context);
                
                if (email && rentalClientEmail === email) {
                    this.logger.log(`Cell ${cellNumber} already rented by the same client (email: ${email}). Will extend rental.`, context);
                    return existingCell;
                }
                throw new BadRequestException(`Ячейка ${cellNumber} уже арендована другим клиентом`);
            } else {
                // Ячейка свободна
                this.logger.log(`Cell found by number: ${existingCell.name} (ID: ${existingCell.id}) - available`, context);
                return existingCell;
            }
        }
        
        this.logger.warn(`Cell not found by number: ${cellNumber}`, context);
    }
    
    return null;
}

  /**
   * Готовит параметры для создания платежа.
   */
  private async _preparePaymentDetails(
    userId: string,
    cell: any,
    amount: number,
    tildaDescription: string,
    tildaInfo: { cellNumber?: string; sizeform?: string; rentalDurationDays?: number; systranid?: string },
  ): Promise<CreateAdminPaymentDto> {
    // Находим активный статус
    const activeStatus = await this.prisma.cellStatus.findFirst({
        where: {
            statusType: 'ACTIVE'
        }
    });

    this.logger.log(`Found active status for Tilda payment: ${activeStatus?.id || 'not found'}`, PaymentsService.name);

    const paymentPayload: Partial<CreateAdminPaymentDto> = {
        userId: userId,
        amount: amount > 0 ? amount : 0,
        status: true,
        rentalDuration: tildaInfo.rentalDurationDays,
        bankPaymentId: tildaInfo.systranid,
        statusId: activeStatus?.id
    };

    const { cellNumber, sizeform } = tildaInfo;

    // Начинаем с описания продуктов из Тильды или ставим заглушку
    let description = tildaDescription || 'Платеж из Tilda';

    // Добавляем конкретный номер ячейки, если он был указан
    if (cellNumber) {
      description += ` (Ячейка: ${cellNumber})`;
    } else if (sizeform) {
      description += ` (Размер: ${sizeform})`;
    }

    // Если мы нашли конкретную ячейку в БД, привязываем платеж к ней
    if (cell) {
      paymentPayload.cellId = cell.id;
    }

    paymentPayload.description = description;

    return paymentPayload as CreateAdminPaymentDto;
  }
} 