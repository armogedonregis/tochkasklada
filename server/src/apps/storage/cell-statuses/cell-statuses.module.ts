import { Module } from '@nestjs/common';
import { CellStatusesService } from './cell-statuses.service';
import { CellStatusesController } from './cell-statuses.controller';

@Module({
  controllers: [CellStatusesController],
  providers: [CellStatusesService],
  exports: [CellStatusesService],
})
export class CellStatusesModule {} 