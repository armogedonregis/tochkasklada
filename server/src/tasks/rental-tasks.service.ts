import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../logger/logger.service';
import { CellRentalsService } from '../cell-rentals/cell-rentals.service';

@Injectable()
export class RentalTasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly cellRentalsService: CellRentalsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    disabled: process.env.DISABLE_RENTAL_TASKS === 'true'
  })
  async handleAutomaticStatusUpdates() {
    this.logger.log('Запуск автоматического обновления статусов аренд...', 'RentalTasksService');
    try {
      const { updatedCount } = await this.cellRentalsService.updateAllRentalStatuses();
      this.logger.log(
        `Обновление статусов завершено: обновлено ${updatedCount} статусов`,
        'RentalTasksService'
      );
    } catch (error) {
      this.logger.error(
        'Ошибка при обновлении статусов аренд:',
        error.stack,
        'RentalTasksService'
      );
    }
  }
} 