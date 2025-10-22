import { Module } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { CellRentalsAdminController } from './cell-rentals.controller';
import { CellRentalsRepo } from './cell-rentals.repo';
import { UsersService } from '@/apps/users/users.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  controllers: [CellRentalsAdminController],
  providers: [CellRentalsService, CellRentalsRepo],
  exports: [CellRentalsService],
})
export class CellRentalsModule {}