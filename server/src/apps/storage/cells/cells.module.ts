import { Module } from '@nestjs/common';
import { CellsService } from './cells.service';
import { CellsController, CellsAdminController } from './cells.controller';

@Module({
  controllers: [CellsController, CellsAdminController],
  providers: [CellsService],
  exports: [CellsService],
})
export class CellsModule {} 