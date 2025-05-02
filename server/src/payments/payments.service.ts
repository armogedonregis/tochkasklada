import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, PaymentParams } from './utils/generate-token';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // Получение платежа по ID
  async getPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
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
          },
        },
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
    const orderId = uuidv4();

    // Создаем запись о платеже в базе данных
    const payment = await this.prisma.payment.create({
      data: {
        amount: data.amount,
        orderId,
        description: data.description,
        userId: data.userId,
        status: false
      }
    });

    // Генерируем ссылку на оплату Tinkoff
    const paymentResult = await this.createTinkoffPayment(orderId);
    
    if (paymentResult.success) {
      // Обновляем запись платежа, добавляя URL для оплаты
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { paymentUrl: paymentResult.url }
      });
      
      return { ...payment, paymentUrl: paymentResult.url };
    }
    
    return payment;
  }

  // Создание платежа администратором
  async createPaymentByAdmin(data: any) {
    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new BadRequestException(`Пользователь с ID ${data.userId} не найден`);
    }

    // Создаем orderId
    const orderId = uuidv4();
    
    // Создаем платеж с предоставленными данными
    return this.prisma.payment.create({
      data: {
        amount: data.amount,
        orderId,
        description: data.description,
        userId: data.userId,
        status: data.status || false,
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
  }

  // Обновление платежа
  async updatePayment(id: string, data: any) {
    // Проверяем, существует ли платеж
    const existingPayment = await this.getPaymentById(id);
    
    if (!existingPayment) {
      throw new NotFoundException(`Платеж с ID ${id} не найден`);
    }
    
    // Обновляем платеж
    return this.prisma.payment.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
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
    
    // Удаляем платеж
    await this.prisma.payment.delete({
      where: { id }
    });
    
    return { success: true, message: `Платеж ${id} успешно удален` };
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
      orderBy: { createdAt: 'desc' }
    });
  }

  // Получение всех платежей (для администратора)
  async getAllPayments() {
    return this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  }
} 