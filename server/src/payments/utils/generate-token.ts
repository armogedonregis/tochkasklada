import * as crypto from 'crypto';

// Интерфейс для параметров платежа Tinkoff
export interface PaymentParams {
  TerminalKey: string;
  Amount: number;
  OrderId: string;
  Description?: string;
  [key: string]: any;
}

/**
 * Генерирует токен для API Tinkoff Bank
 * @param params - Параметры платежа
 * @param password - Секретный пароль терминала
 * @returns Сгенерированный токен
 */
export function generateToken(params: PaymentParams, password: string): string {
  const values = Object.entries(params)
    .filter(([key]) => !['Receipt', 'DATA'].includes(key))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);

  values.Password = password;

  const sortedValues = Object.fromEntries(
    Object.entries(values).sort(([a], [b]) => a.localeCompare(b))
  );

  const concatenatedValues = Object.values(sortedValues).join('');

  return crypto
    .createHash('sha256')
    .update(concatenatedValues)
    .digest('hex');
} 