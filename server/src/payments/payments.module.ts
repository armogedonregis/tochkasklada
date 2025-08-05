import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CellRentalsModule } from '../cell-rentals/cell-rentals.module';
import { ListModule } from '../list/list.module';

@Module({
  imports: [PrismaModule, CellRentalsModule, ListModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {} 