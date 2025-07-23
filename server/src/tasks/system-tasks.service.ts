import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class SystemTasksService {
  constructor(
    private readonly logger: LoggerService,
  ) {}

  @Cron('*/5 * * * *', {
    disabled: process.env.DISABLE_SYSTEM_TASKS === 'true'
  })
  async logSystemStatus() {
    this.logger.log('Проверка состояния системы...', 'SystemTasksService');
    
    const memoryUsage = process.memoryUsage();
    const systemInfo = {
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
      },
      uptime: Math.round(process.uptime() / 60 / 60 * 10) / 10 + ' hours',
      nodeVersion: process.version,
      platform: process.platform,
      pid: process.pid
    };

    this.logger.log(JSON.stringify({
      message: 'Состояние системы',
      ...systemInfo
    }), 'SystemTasksService');
  }
} 