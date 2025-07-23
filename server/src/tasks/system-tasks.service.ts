import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../logger/logger.service';
import * as os from 'os';

@Injectable()
export class SystemTasksService {
  constructor(
    private readonly logger: LoggerService,
  ) {
    this.logger.log('SystemTasksService instantiated', 'SystemTasksService');
  }

  private formatMemory(bytes: number): string {
    return `${Math.round(bytes / 1024 / 1024)}MB`;
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async logSystemStatus() {
    const { heapUsed, rss } = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    const memoryPercent = Math.round((rss / os.totalmem()) * 100);

    const status = {
      heap: this.formatMemory(heapUsed),
      rss: this.formatMemory(rss),
      uptime: this.formatUptime(uptimeSeconds)
    };

    const memoryEmoji = memoryPercent > 80 ? '🔴' : memoryPercent > 50 ? '🟡' : '🟢';

    this.logger.log(
      `${memoryEmoji} Memory: ${status.heap} (RSS: ${status.rss}) (${memoryPercent}%) | Uptime: ${status.uptime}`,
      'SystemMonitor'
    );
  }
} 