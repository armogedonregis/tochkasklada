import { Module } from '@nestjs/common';
import { RelaysService } from './relays.service';
import { RelaysController } from './relays.controller';

@Module({
  controllers: [RelaysController],
  providers: [RelaysService],
  exports: [RelaysService],
})
export class RelaysModule {} 