import { Module } from '@nestjs/common';
import { CellsService } from './cells.service';
import { CellsController, CellsAdminController } from './cells.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [PrismaModule, RolesModule],
  controllers: [CellsController, CellsAdminController],
  providers: [CellsService],
  exports: [CellsService],
})
export class CellsModule {} 