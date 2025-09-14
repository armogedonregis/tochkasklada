import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsController } from './clients.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [PrismaModule, RolesModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {} 