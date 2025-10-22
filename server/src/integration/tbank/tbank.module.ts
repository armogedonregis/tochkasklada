import { Module } from '@nestjs/common';
import { TBankService } from './tbank.service';

@Module({
  providers: [TBankService],
  exports: [TBankService],
})
export class TbankModule {} 