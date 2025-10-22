import { Module } from '@nestjs/common';
import { TbankModule } from './tbank/tbank.module';

@Module({
  imports: [TbankModule],
  exports: [TbankModule],
})
export class IntegrationModule {} 