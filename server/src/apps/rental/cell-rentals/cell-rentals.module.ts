import { Module } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { CellRentalsAdminController } from './cell-rentals.controller';
import { RolesModule } from '@/apps/roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [CellRentalsAdminController],
  providers: [CellRentalsService],
  exports: [CellRentalsService],
})
export class CellRentalsModule {} 