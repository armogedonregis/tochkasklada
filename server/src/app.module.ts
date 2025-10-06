import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '@/infrastructure/logger/logger.module';
import { LogsModule } from '@/infrastructure/logs/logs.module';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { TasksModule } from '@/tasks/tasks.module';
import { AuthModule } from '@/apps/auth/auth.module';
import { RolesModule } from '@/apps/roles/roles.module';
import { UsersModule } from '@/apps/users/users.module';
import { AdminsModule } from '@/apps/users/admins/admins.module';
import { ClientsModule } from '@/apps/users/clients/clients.module';
import { StorageModule } from '@/apps/storage/storage.module';
import { RentalModule } from '@/apps/rental/rental.module';
import { LeadManagementModule } from '@/apps/lead-management/lead-management.module';
import { StatisticsModule } from '@/apps/statistics/statistics.module';
import { ControlPanelModule } from '@/apps/control-panel/control-panel.module';
import { SwaggerDocModule } from './swagger/swagger.module';
import { AdminAuditModule } from '@/common/admin-audit.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminAuditInterceptor } from './common/interceptors/admin-audit.interceptor';
import { MailModule } from './infrastructure/mail/mail.module';

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
    LogsModule,
    PrismaModule,
    TasksModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    ClientsModule,
    StorageModule,
    RentalModule,
    LeadManagementModule,
    RolesModule,
    StatisticsModule,
    ControlPanelModule,
    AdminAuditModule,
    MailModule,
    SwaggerDocModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AdminAuditInterceptor,
    },
  ],
})
export class AppModule { }
