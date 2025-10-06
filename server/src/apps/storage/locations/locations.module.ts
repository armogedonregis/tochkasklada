import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController, LocationsAdminController } from './locations.controller';

@Module({
  controllers: [LocationsController, LocationsAdminController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {} 