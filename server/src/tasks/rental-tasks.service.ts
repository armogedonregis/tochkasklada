import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CellRentalsService } from '@/apps/rental/cell-rentals/cell-rentals.service';

@Injectable()
export class RentalTasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly cellRentalsService: CellRentalsService,
  ) {
    this.logger.log('RentalTasksService instantiated', 'RentalTasksService');
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleAutomaticStatusUpdates() {
    try {
      const { updatedCount } = await this.cellRentalsService.updateAllRentalStatuses();
      this.logger.log(
        `🔄 Обновление статусов завершено: обновлено ${updatedCount} статусов`,
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