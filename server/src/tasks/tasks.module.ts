import { Module } from '@nestjs/common';
import { SystemTasksService } from './system-tasks.service';
import { RentalTasksService } from './rental-tasks.service';
import { EmailTasksService } from './email-tasks.service';
import { CellRentalsModule } from '@/apps/rental/cell-rentals/cell-rentals.module';
import { MailModule } from '@/infrastructure/mail/mail.module';

@Module({
  imports: [
    CellRentalsModule,
    // MailModule,
  ],
  providers: [
    SystemTasksService,
    RentalTasksService,
    // EmailTasksService,
  ],
})
export class TasksModule {} 