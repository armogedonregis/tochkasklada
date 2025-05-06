import { Module } from '@nestjs/common';
import { RelaysService } from './relays.service';
import { RelaysController } from './relays.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RelaysController],
  providers: [RelaysService],
  exports: [RelaysService],
})
export class RelaysModule {} 