import { Injectable, Inject } from '@nestjs/common';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { TBankConfig, TBankNotification, TBankPaymentParams, TBankPaymentResponse } from './tbank.interface';
import { generateToken } from './utils/generate-token';

@Injectable()
export class TBankService {
  private readonly config: TBankConfig;

  constructor(
    private readonly logger: LoggerService,
  ) {
    this.config = {
      terminalKey: process.env.TBANK_TERMINAL_KEY || '',
      password: process.env.TBANK_PASSWORD || '',
      baseUrl: 'https://securepay.tinkoff.ru/v2'
    };
    
    this.validateConfig();
  }

  private validateConfig() {
    if (!this.config.terminalKey || !this.config.password) {
      throw new Error('TBank configuration is missing');
    }
  }

  async createPayment(orderId: string, amount: number, description?: string): Promise<TBankPaymentResponse> {
    try {
      const amountInKopecks = Math.round(amount * 100);
      
      if (amountInKopecks < 1000) { // 10 руб в копейках
        throw new Error(`Payment amount must be at least 10 RUB`);
      }

      const params: TBankPaymentParams = {
        TerminalKey: this.config.terminalKey,
        Amount: amountInKopecks,
        OrderId: orderId,
        Description: description
      };

      const token = generateToken(params, this.config.password);

      const response = await fetch(`${this.config.baseUrl}/Init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          Token: token
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: TBankPaymentResponse = await response.json();

      if (!responseData.Success) {
        this.logger.error(`TBank payment failed: ${responseData.Message}`, '', 'TBankService');
      }

      return responseData;

    } catch (error) {
      this.logger.error(`TBank payment creation failed: ${error.message}`, error.stack, 'TBankService');
      throw error;
    }
  }

  async handleNotification(notification: TBankNotification): Promise<{ success: boolean; message: string }> {
    try {
      // Валидация уведомления
      if (!notification.OrderId || notification.Status === undefined) {
        return { success: false, message: 'Invalid notification' };
      }

      const isSuccess = notification.Status === 'CONFIRMED' || notification.Status === 'AUTHORIZED';

      return { 
        success: true, 
        message: `Payment status: ${isSuccess ? 'successful' : 'unsuccessful'}` 
      };

    } catch (error) {
      this.logger.error(`TBank notification handling failed: ${error.message}`, error.stack, 'TBankService');
      return { success: false, message: 'Internal server error' };
    }
  }
}