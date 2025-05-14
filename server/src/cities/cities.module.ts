import { Module } from '@nestjs/common';
import { CitiesController, CitiesAdminController } from './cities.controller';
import { CitiesService } from './cities.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CitiesController, CitiesAdminController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {} 