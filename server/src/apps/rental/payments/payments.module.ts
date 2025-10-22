import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CellRentalsModule } from '@/apps/rental/cell-rentals/cell-rentals.module';
import { ListModule } from '@/apps/lead-management/list/list.module';
import { RequestsModule } from '@/apps/lead-management/requests/requests.module';
import { UsersService } from '@/apps/users/users.service';
import { TbankModule } from 'src/integration/tbank/tbank.module';
import { PaymentsRepo } from './payment.repo';
import { TildaPaymentsService } from './tilda-payments.service';
import { TBankService } from '@/integration/tbank/tbank.service';
import { UsersModule } from '@/apps/users/users.module';

@Module({
  imports: [CellRentalsModule, ListModule, RequestsModule, UsersModule, TbankModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, TildaPaymentsService, PaymentsRepo],
  exports: [PaymentsService],
})
export class PaymentsModule {} 