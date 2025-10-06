import { Module } from '@nestjs/common';
import { RelayAccessService } from './relay-access.service';
import { RelayAccessController } from './relay-access.controller';

@Module({
  controllers: [RelayAccessController],
  providers: [RelayAccessService],
  exports: [RelayAccessService],
})
export class RelayAccessModule {} 