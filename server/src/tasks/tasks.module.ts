import { Module } from '@nestjs/common';
import { SystemTasksService } from './system-tasks.service';
import { RentalTasksService } from './rental-tasks.service';
import { EmailTasksService } from './email-tasks.service';
import { LoggerModule } from '../logger/logger.module';
import { CellRentalsModule } from '../cell-rentals/cell-rentals.module';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    LoggerModule,
    CellRentalsModule,
    // MailModule,
    PrismaModule,
  ],
  providers: [
    SystemTasksService,
    RentalTasksService,
    // EmailTasksService,
  ],
})
export class TasksModule {} 