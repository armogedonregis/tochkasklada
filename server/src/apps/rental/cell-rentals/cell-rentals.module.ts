import { Module } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { CellRentalsAdminController } from './cell-rentals.controller';
import { CellRentalsRepo } from './cell-rentals.repo';

@Module({
  controllers: [CellRentalsAdminController],
  providers: [CellRentalsService, CellRentalsRepo],
  exports: [CellRentalsService, CellRentalsRepo],
})
export class CellRentalsModule {}