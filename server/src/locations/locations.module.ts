import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController, LocationsAdminController } from './locations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [PrismaModule, RolesModule],
  controllers: [LocationsController, LocationsAdminController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {} 