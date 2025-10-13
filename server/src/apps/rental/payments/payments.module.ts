import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CellRentalsModule } from '@/apps/rental/cell-rentals/cell-rentals.module';
import { ListModule } from '@/apps/lead-management/list/list.module';
import { RequestsModule } from '@/apps/lead-management/requests/requests.module';

@Module({
  imports: [CellRentalsModule, ListModule, RequestsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {} 