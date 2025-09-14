import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [PrismaModule, LoggerModule, RolesModule],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {} 