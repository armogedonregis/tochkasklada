import { Module } from '@nestjs/common';
import { SystemTasksService } from './system-tasks.service';
import { RentalTasksService } from './rental-tasks.service';
import { LoggerModule } from '../logger/logger.module';
import { CellRentalsModule } from '../cell-rentals/cell-rentals.module';

@Module({
  imports: [
    LoggerModule,
    CellRentalsModule,
  ],
  providers: [
    SystemTasksService,
    RentalTasksService,
  ],
})
export class TasksModule {} 