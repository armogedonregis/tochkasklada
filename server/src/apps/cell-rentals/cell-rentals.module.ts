import { Module } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { CellRentalsAdminController } from './cell-rentals.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot(), RolesModule],
  controllers: [CellRentalsAdminController],
  providers: [CellRentalsService],
  exports: [CellRentalsService],
})
export class CellRentalsModule {} 