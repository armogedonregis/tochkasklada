import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, PaymentParams } from './utils/generate-token';
import { CreateAdminPaymentDto, UpdatePaymentDto, FindPaymentsDto, PaymentSortField, SortDirection } from './dto';
import { Prisma } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    if (this.logger.debug) {
      this.logger.debug('PaymentsService instantiated', PaymentsService.name);
    }
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
        tinkoffPaymentId: data.tinkoffPaymentId,
        paymentUrl: data.paymentUrl
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
        
        // Длительность аренды по умолчанию 30 дней (раньше передавалась rentalDays)
        const rentalDurationDays = 30;
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
                description: description || `Продление аренды ячейки #${cell.name} на ${rentalDurationDays} дн.`
              }
            });
            this.logger.log('Payment linked to extended rental', PaymentsService.name);
          } else {
            this.logger.error(`Cell ${cell.name} already rented by another client`, '', PaymentsService.name);
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
          
          rental = await this.prisma.cellRental.create({
            data: {
              cellId: data.cellId,
              clientId: user.client.id,
              startDate,
              endDate,
              isActive: true,
              statusId: data.statusId
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
        
        // Проверяем, не арендована ли уже ячейка
        const existingRental = await this.prisma.cellRental.findFirst({
          where: {
            cellId,
            isActive: true
          }
        });
        
        if (existingRental) {
          throw new BadRequestException(`Ячейка ${cell.name} уже арендована`);
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
    return this.prisma.payment.update({
      where: { id },
      data: paymentData,
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
        // Если остались другие платежи – откатываем срок аренды на 30 дней
        // Получаем текущую аренду
        const rental = await this.prisma.cellRental.findUnique({
          where: { id: cellRentalId }
        });
        if (rental) {
          const newEndDate = new Date(rental.endDate);
          newEndDate.setDate(newEndDate.getDate() - 30);
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
        // Сохраняем ID платежа от Tinkoff, если он есть
        if (responseData.PaymentId) {
          await this.prisma.payment.update({
            where: { orderId },
            data: { tinkoffPaymentId: responseData.PaymentId }
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
          tinkoffPaymentId: data.PaymentId || payment.tinkoffPaymentId
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
    // 0. Обрабатываем только формы с именем 'Cart'
    if (payload.formname && payload.formname !== 'Cart') {
      this.logger.warn(`Tilda webhook ignored: unsupported formname '${payload.formname}'`, 'createTildaPayment');
      return { success: false, message: 'Форма не поддерживается' };
    }

    // 1. Поля могут приходить с разным регистром
    const email = payload.email || payload.Email || payload.EMAIL;
    const phone = payload.phone || payload.Phone || payload.PHONE;
    const name = payload.name || payload.Name || 'Клиент из Tilda';

    // 2. Получаем номер ячейки из individualnumber, если есть
    let cellNumber: string | undefined = payload.individualnumber || payload.INDIVIDUALNUMBER || payload.individualNumber || payload.IndividualNumber;
    let sizeform: string | undefined = payload.sizeform;

    // 3. Если есть строка payment – в ней JSON, достаем сумму и products
    let paymentJson: any = null;
    if (typeof payload.payment === 'string') {
      this.logger.log(`Parsing payment JSON: ${payload.payment}`, 'createTildaPayment');
      try {
        paymentJson = JSON.parse(payload.payment);
        this.logger.log(`Payment JSON parsed successfully: ${JSON.stringify(paymentJson)}`, 'createTildaPayment');
      } catch (e) {
        this.logger.error(`Не удалось распарсить поле payment: ${e.message}`, e.stack, 'createTildaPayment');
      }
    } else {
      this.logger.log('Payment field is not a string, skipping JSON parsing', 'createTildaPayment');
    }

    // 4. Сумма
    let amountNum = 0;
    if (paymentJson?.amount) {
      amountNum = Number(paymentJson.amount);
      this.logger.log(`Amount from payment JSON: ${amountNum}`, 'createTildaPayment');
    } else if (payload.amount) {
      amountNum = Number(payload.amount);
      this.logger.log(`Amount from payload: ${amountNum}`, 'createTildaPayment');
    }
    if (isNaN(amountNum) || amountNum < 0) {
      this.logger.warn(`Invalid amount: ${amountNum}, setting to 0`, 'createTildaPayment');
      amountNum = 0;
    }
    this.logger.debug(`Tilda amount parsed: ${amountNum}`, 'createTildaPayment');

    // 4.1 Формируем description из products, если есть
    let tildaDescription = '';
    if (Array.isArray(paymentJson?.products) && paymentJson.products.length > 0) {
      tildaDescription = paymentJson.products.join('; ');
      this.logger.log(`Description from products: ${tildaDescription}`, 'createTildaPayment');
    }

    // 5. Если sizeform нет, пробуем из products[0] (для размера)
    if (!sizeform && Array.isArray(paymentJson?.products) && paymentJson.products.length > 0) {
      const prod = paymentJson.products[0] as string;
      this.logger.log(`Extracting sizeform from product: ${prod}`, 'createTildaPayment');
      // Извлекаем строку внутри скобок
      const bracketMatch = prod.match(/\(([^)]+)\)/);
      if (bracketMatch) {
        // Берём только первую часть до запятой (если есть)
        sizeform = bracketMatch[1].split(',')[0].trim(); // "XS-1-shu"
        this.logger.log(`Sizeform extracted: ${sizeform}`, 'createTildaPayment');
      } else {
        this.logger.warn(`No brackets found in product: ${prod}`, 'createTildaPayment');
      }
    }
    this.logger.debug?.(`Tilda sizeform parsed: ${sizeform}`, 'createTildaPayment');

    if (!email) {
      throw new BadRequestException('Email не был получен от Tilda');
    }
  
    // 6. Найти или создать пользователя
    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { client: true },
    });
  
    if (!user) {
      // Если пользователя нет, создаем его и связанного клиента
      user = await this.prisma.user.create({
        data: {
          email,
          password: uuidv4(), 
          client: {
            create: {
              name: name || 'Клиент из Tilda',
              phones: {
                create: {
                  phone: phone || '',
                },
              },
            },
          },
        },
        include: { client: true },
      });
      this.logger.log(`User created: ${user.email}`, 'createTildaPayment');
    } else if (!user.client) {
      // Если пользователь есть, а клиента нет - создаем клиента
      const client = await this.prisma.client.create({
        data: {
          userId: user.id,
          name: name || 'Клиент из Tilda',
           phones: {
            create: {
              phone: phone || '',
            },
          },
        }
      });
      user = { ...user, client };
    }

    if (!user || !user.client) {
        throw new InternalServerErrorException('Не удалось найти или создать клиента для пользователя');
    }

    // 7. Поиск ячейки: сначала по номеру, потом по размеру/локации
    let cell: any = null;
    if (cellNumber) {
      this.logger.log(`Searching for cell by number: ${cellNumber}`, 'createTildaPayment');
      cell = await this.prisma.cells.findFirst({
        where: {
          name: {
            equals: cellNumber,
            mode: 'insensitive' // Регистронезависимый поиск
          },
          status: { name: 'Свободна' },
          rentals: {
            none: {
              isActive: true,
            },
          },
        }
      });
      this.logger.debug?.(`Tilda cell search by number: ${cellNumber}, found: ${!!cell}`, 'createTildaPayment');
      if (cell) {
        this.logger.log(`Cell found by number: ${cell.name} (ID: ${cell.id})`, 'createTildaPayment');
      } else {
        this.logger.warn(`Cell not found by number: ${cellNumber}`, 'createTildaPayment');
      }
    }
    // Если не нашли по номеру, пробуем по размеру и локации
    if (!cell && sizeform) {
      this.logger.log(`Searching for cell by size/location: ${sizeform}`, 'createTildaPayment');
      const [size, location] = sizeform.split(' ');
      if (size && location) {
        cell = await this.prisma.cells.findFirst({
          where: {
            size: { name: size },
            container: {
              location: {
                name: { contains: location, mode: 'insensitive' }
              }
            },
            status: { name: 'Свободна' },
            rentals: {
              none: {
                isActive: true
              }
            }
          }
        });
        this.logger.debug?.(`Tilda cell search by size/location: size=${size}, location=${location}, found=${!!cell}`, 'createTildaPayment');
        if (cell) {
          this.logger.log(`Cell found by size/location: ${cell.name} (ID: ${cell.id})`, 'createTildaPayment');
        } else {
          this.logger.warn(`Cell not found by size/location: size=${size}, location=${location}`, 'createTildaPayment');
        }
      }
    }

    if (!cell) {
      // Если ячейка не найдена, можно создать просто платеж-заявку
      this.logger.log('Свободная ячейка не найдена. Создание заявки.', 'createTildaPayment');
      return this.createPaymentByAdmin({
        userId: user.id,
        amount: amountNum, // Корректная сумма
        description: tildaDescription || `Заявка с Tilda${cellNumber ? ` на ячейку ${cellNumber}` : ''}${sizeform ? ` (${sizeform})` : ''}`,
        status: false,
      });
    }
  
    // 8. Создать/заявить платеж через существующий метод
    if (amountNum <= 0) {
      // Если суммы нет, можно просто создать заявку без суммы
      if (cell && cell.name && cell.id) {
        this.logger.log(`Некорректная сумма. Создание заявки для ${email} на ячейку ${cell.name}.`, 'createTildaPayment');
        return this.createPaymentByAdmin({
          userId: user.id,
          amount: 0,
          description: tildaDescription || `Заявка с Tilda на ячейку ${cell.name}`,
          status: false,
        });
      } else {
        // fallback, если вдруг cell невалиден
        return this.createPaymentByAdmin({
          userId: user.id,
          amount: 0,
          description: tildaDescription || `Заявка с Tilda (ячейка не определена)`,
          status: false,
        });
      }
    }

    if (cell && cell.id && cell.name) {
      return this.createPaymentByAdmin({
        userId: user.id,
        cellId: cell.id,
        amount: amountNum,
        description: tildaDescription || `Аренда ячейки ${cell.name} (из Tilda)` ,
        status: false, // Платеж должен быть создан как неоплаченный
      });
    } else {
      // fallback, если вдруг cell невалиден
      return this.createPaymentByAdmin({
        userId: user.id,
        amount: amountNum,
        description: tildaDescription || `Аренда ячейки (ячейка не определена, из Tilda)`,
        status: false,
      });
    }
  }
} 