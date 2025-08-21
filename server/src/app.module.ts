import { Module } from '@nestjs/common';
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
import { LoggerModule } from './logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { ListModule } from './list/list.module';
import { RequestsModule } from './requests/requests.module';
import { AdminsModule } from './admins/admins.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...(process.env.NODE_ENV !== 'production' && {
        envFilePath: '../.env'
      }),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    PrismaModule,
    TasksModule,
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
    ListModule,
    RequestsModule,
    AdminsModule,
    RolesModule,
    StatisticsModule,
    LogsModule,
    SwaggerDocModule.forRoot(),
  ],
})
export class AppModule { }
