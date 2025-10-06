import { Module } from '@nestjs/common';
import { ListModule } from './list/list.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ListModule,
    RequestsModule
  ],
})
export class LeadManagementModule {}