import { Module } from '@nestjs/common';
import { AdminAuditService } from '@/common/services/admin-audit.service';
import { AdminAuditInterceptor } from '@/common/interceptors/admin-audit.interceptor';
import { AdminAuditController } from '@/common/admin-audit.controller';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { LoggerModule } from '@/infrastructure/logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [AdminAuditService, AdminAuditInterceptor],
  controllers: [AdminAuditController],
  exports: [AdminAuditService, AdminAuditInterceptor],
})
export class AdminAuditModule {}
