import { Module } from '@nestjs/common';
import { CitiesController, CitiesAdminController } from './cities.controller';
import { CitiesService } from './cities.service';

@Module({
  controllers: [CitiesController, CitiesAdminController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {} 