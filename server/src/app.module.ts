import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { SizesModule } from './sizes/sizes.module';
import { CellsModule } from './cells/cells.module';
import { ContainersModule } from './containers/containers.module';
import { LocationsModule } from './locations/locations.module';
import { CitiesModule } from './cities/cities.module';
import { PaymentsModule } from './payments/payments.module';
import { CellStatusesModule } from './cell-statuses/cell-statuses.module';
import { PanelsModule } from './panels/panels.module';
import { RelaysModule } from './relays/relays.module';
import { RelayAccessModule } from './relay-access/relay-access.module';
import { CellRentalsModule } from './cell-rentals/cell-rentals.module';
import { SwaggerDocModule } from './swagger/swagger.module';
import { StatisticsModule } from './statistics/statistics.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    SizesModule,
    CellsModule,
    ContainersModule,
    LocationsModule,
    CitiesModule,
    PaymentsModule,
    CellStatusesModule,
    PanelsModule,
    RelaysModule,
    RelayAccessModule,
    CellRentalsModule,
    StatisticsModule,
    LogsModule,
    SwaggerDocModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
