import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailStatus, EmailType } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.log('MailService instantiated', 'MailService');
  }

  /**
   * Метод для отправки email
   * @param to 
   * @param subject 
   * @param text 
   * @param html 
   * @returns 
   */
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      this.logger.log(`Sending email to ${to} with subject: ${subject}`, 'MailService');
      
      await this.mailerService.sendMail({
        to,
        subject,
        text,
        html: html || text,
      });
      
      this.logger.log(`Email sent successfully to ${to}`, 'MailService');
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${error.message}`,
        error.stack,
        'MailService'
      );
      return false;
    }
  }

  /**
   * Метод для отправки уведомления
   * @param email
   * @param daysLeft 
   * @param cellNumber 
   * @param expirationDate 
   * @returns 
   */
  async sendRentalExpirationNotification(
    email: string,
    daysLeft: number, 
    cellNumber: string,
    expirationDate: string
  ) {
    
    const subject = `Уведомление об окончании срока аренды (осталось ${daysLeft} дн.)`;
    
    const text = `
    Уважаемый клиент,

    Напоминаем, что срок аренды ячейки №${cellNumber} заканчивается (${expirationDate}).

    Пожалуйста, не забудьте продлить аренду или освободить ячейку до указанной даты.

    С уважением,
    Команда Точка Склада
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Уведомление об окончании срока аренды</h2>
      <p>Уважаемый <strong>клиент</strong>,</p>
      <p>Напоминаем, что срок аренды ячейки <strong>№${cellNumber}</strong> заканчивается <strong>${expirationDate}</strong>.</p>
      <p>Пожалуйста, не забудьте продлить аренду или освободить ячейку до указанной даты.</p>
      <p style="margin-top: 30px;">С уважением,<br>Команда Точка Склада</p>
    </div>
    `;

    return this.sendEmail(email, subject, text, html);
  }

  private getDayWord(days: number): string {
    if (days === 1) return 'день';
    if (days > 1 && days < 5) return 'дня';
    return 'дней';
  }

  /**
   * Метод для логгирования отправка email
   * @param to 
   * @param subject 
   * @param type 
   * @param status 
   * @param rentalId 
   * @param clientId 
   * @param error 
   */
  async logEmail(
    to: string,
    subject: string,
    type: EmailType,
    status: EmailStatus,
    rentalId?: string,
    clientId?: string | null,
    error?: string,
  ) {
    try {
      await this.prisma.emailLog.create({
        data: {
          to,
          subject,
          type: type, 
          status: status,
          error,
          rentalId,
          clientId
        }
      });
    } catch (logError) {
      this.logger.error(
        `Failed to log email: ${logError.message}`,
        logError.stack,
        'MailService'
      );
    }
  }
}
