import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CellRentalsService } from '@/apps/rental/cell-rentals/cell-rentals.service';
import { MailService } from '@/infrastructure/mail/mail.service';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class EmailTasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly cellRentalsService: CellRentalsService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.log('EmailTasksService instantiated', 'EmailTasksService');
  }

  // @Cron(CronExpression.EVERY_DAY_AT_10AM)
  // async handleRentalExpirationNotifications() {
  //   this.logger.log('Starting rental expiration email notifications task', 'EmailTasksService');
    
  //   try {
  //     // Отправка уведомлений за 7 дней
  //     await this.sendExpirationNotifications(7);
      
  //     // Отправка уведомлений за 3 дня
  //     await this.sendExpirationNotifications(3);
      
  //     // Отправка уведомлений за 1 день
  //     await this.sendExpirationNotifications(1);
      
  //     this.logger.log('Completed rental expiration email notifications task', 'EmailTasksService');
  //   } catch (error) {
  //     this.logger.error(
  //       'Error in rental expiration email notifications task',
  //       error.stack,
  //       'EmailTasksService'
  //     );
  //   }
  // }

  // private async sendExpirationNotifications(daysBeforeExpiration: number) {
  //   const today = new Date();
  //   const targetDate = new Date(today);
  //   targetDate.setDate(today.getDate() + daysBeforeExpiration);
    
  //   // Устанавливаем время на начало дня для targetDate
  //   targetDate.setHours(0, 0, 0, 0);
    
  //   // Конец дня
  //   const endOfDay = new Date(targetDate);
  //   endOfDay.setHours(23, 59, 59, 999);

  //   this.logger.log(
  //     `Finding rentals expiring on ${targetDate.toISOString().split('T')[0]} (${daysBeforeExpiration} days from now)`,
  //     'EmailTasksService'
  //   );

  // //   // Находим все аренды, которые истекают через указанное количество дней
  //   const expiringRentals = await this.prisma.cellRental.findMany({
  //     where: {
  //       endDate: {
  //         gte: targetDate,
  //         lte: endOfDay,
  //       },
  //       status: {
  //         isNot: {
  //           statusType: {
  //             notIn: ['CLOSED']
  //           }
  //         }
  //       }
  //     },
  //     include: {
  //       client: true,
  //       cell: {
  //         include: {
  //           container: true
  //         }
  //       }
  //     }
  //   });

  //   this.logger.log(
  //     `Found ${expiringRentals.length} rentals expiring in ${daysBeforeExpiration} days`,
  //     'EmailTasksService'
  //   );

  //   let successCount = 0;

  // //   // Отправляем уведомления для каждой аренды
  //   for (const rental of expiringRentals) {
  //     if (!rental.client?.email) {
  //       this.logger.warn(
  //         `Client ${rental.client?.id || rental.clientId} has no email address`,
  //         'EmailTasksService'
  //       );
  //       continue;
  //     }

  //     const cellNumber = rental.cell[0]?.number || 'неизвестно';
  //     const clientName = rental.client.name || 'Клиент';
      
  //     const success = await this.mailService.sendRentalExpirationNotification(
  //       rental.client.email,
  //       clientName,
  //       daysBeforeExpiration,
  //       cellNumber,
  //       rental.endDate
  //     );

  //     if (success) {
  //       successCount++;
  //     }
  //   }

  //   this.logger.log(
  //     `Successfully sent ${successCount} of ${expiringRentals.length} notifications for ${daysBeforeExpiration}-day expiration`,
  //     'EmailTasksService'
  //   );

  //   return { total: expiringRentals.length, sent: successCount };
  // }
}
