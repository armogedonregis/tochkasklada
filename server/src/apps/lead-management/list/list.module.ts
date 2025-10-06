import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { RolesModule } from '../../roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {} 