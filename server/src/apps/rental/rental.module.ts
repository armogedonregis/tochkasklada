import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { CellRentalsModule } from './cell-rentals/cell-rentals.module';


@Module({
  imports: [
    PaymentsModule,
    CellRentalsModule
  ],
})
export class RentalModule {}