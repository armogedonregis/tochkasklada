import { Module } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { CellRentalsAdminController } from './cell-rentals.controller';

@Module({
  controllers: [CellRentalsAdminController],
  providers: [CellRentalsService],
  exports: [CellRentalsService],
})
export class CellRentalsModule {}