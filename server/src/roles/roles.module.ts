import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
