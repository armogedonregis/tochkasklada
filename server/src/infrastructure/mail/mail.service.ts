import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('MailService instantiated', 'MailService');
  }

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

  async sendRentalExpirationNotification(
    email: string, 
    clientName: string, 
    daysLeft: number, 
    cellNumber: string,
    expirationDate: string
  ) {
    
    const subject = `Уведомление об окончании срока аренды (осталось ${daysLeft} дн.)`;
    
    const text = `
    Уважаемый(ая) ${clientName},

    Напоминаем, что срок аренды ячейки №${cellNumber} истекает через ${daysLeft} ${this.getDayWord(daysLeft)} (${expirationDate}).

    Пожалуйста, не забудьте продлить аренду или освободить ячейку до указанной даты.

    С уважением,
    Команда Точка Склада
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Уведомление об окончании срока аренды</h2>
      <p>Уважаемый(ая) <strong>${clientName}</strong>,</p>
      <p>Напоминаем, что срок аренды ячейки <strong>№${cellNumber}</strong> истекает через <strong>${daysLeft} ${this.getDayWord(daysLeft)}</strong> (${expirationDate}).</p>
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
}
