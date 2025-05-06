import { Module } from '@nestjs/common';
import { CellStatusesService } from './cell-statuses.service';
import { CellStatusesController } from './cell-statuses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CellStatusesController],
  providers: [CellStatusesService],
  exports: [CellStatusesService],
})
export class CellStatusesModule {} 