import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { RolesModule } from '../roles/roles.module';
import { ContainersModule } from './containers/containers.module';
import { CitiesModule } from './cities/cities.module';
import { CellsModule } from './cells/cells.module';

@Module({
  imports: [
    PrismaModule,
    RolesModule,
    LocationsModule,
    CitiesModule,
    ContainersModule,
    CellsModule
  ],
})
export class LocationsModule {}