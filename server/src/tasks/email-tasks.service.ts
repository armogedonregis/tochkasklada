import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CellRentalsService } from '@/apps/rental/cell-rentals/cell-rentals.service';
import { MailService } from '@/infrastructure/mail/mail.service';
import { CellRentalsRepo } from '@/apps/rental/cell-rentals/cell-rentals.repo';
import { EmailStatus, EmailType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailTasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly cellRentalsRepo: CellRentalsRepo,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('EmailTasksService instantiated', 'EmailTasksService');
  }

  @Cron(CronExpression.EVERY_DAY_AT_4PM)
  async handleRentalExpirationNotifications() {
    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.log('Email notifications skipped in development mode', 'EmailTasksService');
      return;
    }
    
    this.logger.log('Starting rental expiration email notifications task', 'EmailTasksService');

    try {
      await this.sendAllExpirationNotifications();
      this.logger.log('Completed rental expiration email notifications task', 'EmailTasksService');
    } catch (error) {
      this.logger.error(
        'Error in rental expiration email notifications task',
        error.stack,
        'EmailTasksService'
      );
    }
  }

  private async sendAllExpirationNotifications() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeRentals = await this.cellRentalsRepo.findRentalsForEmailNotifications(
      new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // от 7 дней назад
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)  // до 7 дней вперед
  );

    let sent7Days = 0;
    let sent3Days = 0;
    let sent1Day = 0;
    let sentExpired = 0;

    for (const rental of activeRentals) {
      if (!rental.client?.user?.email) continue;

      const now = new Date();
      const endDate = new Date(rental.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let notificationType: string;
      let shouldSend = false;

      if (daysLeft === 7) {
        notificationType = '7 дней';
        shouldSend = true;
        sent7Days++;
      } else if (daysLeft === 3) {
        notificationType = '3 дня';
        shouldSend = true;
        sent3Days++;
      } else if (daysLeft === 1) {
        notificationType = '1 день';
        shouldSend = true;
        sent1Day++;
      } else if (daysLeft <= 0) {
        notificationType = 'просрочено';
        shouldSend = true;
        sentExpired++;
      }

      if (shouldSend) {
        const cellNumbers = rental.cell.map(cell => cell.name).join(', ');
        const clientName = rental.client.name || 'Клиент';
        const daysForEmail = daysLeft >= 0 ? daysLeft : 0;

        const success = await this.mailService.sendRentalExpirationNotification(
          rental.client.user.email,
          clientName,
          daysForEmail,
          cellNumbers,
          rental.endDate.toISOString().split('T')[0]
        );

        await this.mailService.logEmail(
          rental.client.user.email,
          `Уведомление об окончании срока аренды (осталось ${daysForEmail} дн.)`,
          EmailType.RENTAL_EXPIRATION,
          success ? EmailStatus.SENT : EmailStatus.FAILED,
          rental.id,
          rental.clientId,
          success ? undefined : 'Ошибка при отправке email'
        );
      }
    }

    this.logger.log(
      `Email notifications sent: 7 days - ${sent7Days}, 3 days - ${sent3Days}, 1 day - ${sent1Day}, expired - ${sentExpired}`,
      'EmailTasksService'
    );
  }
}
