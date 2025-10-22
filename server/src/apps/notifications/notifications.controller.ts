import { Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FindEmailLogsDto } from './dto/find-email-logs.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('emails')
  async getEmailLogs(@Query() query: FindEmailLogsDto) {
    return this.notificationsService.findEmailLogs(query);
  }

  @Get('emails/stats')
  async getEmailStats() {
    return this.notificationsService.getEmailStats();
  }
}