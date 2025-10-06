import { Module } from '@nestjs/common';
import { ContainersModule } from './containers/containers.module';
import { CitiesModule } from './cities/cities.module';
import { CellsModule } from './cells/cells.module';
import { LocationsModule } from './locations/locations.module';
import { CellStatusesModule } from './cell-statuses/cell-statuses.module';
import { SizesModule } from './sizes/sizes.module';

@Module({
  imports: [
    LocationsModule,
    CitiesModule,
    ContainersModule,
    CellsModule,
    CellStatusesModule,
    SizesModule
  ],
})
export class StorageModule {}