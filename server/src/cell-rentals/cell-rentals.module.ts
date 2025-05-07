import { Module } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { CellRentalsController } from './cell-rentals.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [CellRentalsController],
  providers: [CellRentalsService],
  exports: [CellRentalsService],
})
export class CellRentalsModule {} 