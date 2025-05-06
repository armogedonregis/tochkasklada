import { Module } from '@nestjs/common';
import { RelayAccessService } from './relay-access.service';
import { RelayAccessController } from './relay-access.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RelayAccessController],
  providers: [RelayAccessService],
  exports: [RelayAccessService],
})
export class RelayAccessModule {} 