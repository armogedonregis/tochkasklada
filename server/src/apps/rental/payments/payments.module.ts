import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { CellRentalsModule } from '@/apps/rental/cell-rentals/cell-rentals.module';
import { ListModule } from '@/apps/lead-management/list/list.module';
import { RequestsModule } from '@/apps/lead-management/requests/requests.module';
import { RolesModule } from '@/apps/roles/roles.module';

@Module({
  imports: [PrismaModule, CellRentalsModule, ListModule, RequestsModule, RolesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {} 