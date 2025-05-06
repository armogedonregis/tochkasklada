import * as crypto from 'crypto';

// Функция для нормализации ключа до 32 байт
function normalizeKey(key: string): Buffer {
  // Если ключ короче 32 байт, дополняем его повторением
  // Если длиннее - обрезаем до 32 байт
  const normalized = Buffer.alloc(32);
  const keyBuffer = Buffer.from(key);
  
  for (let i = 0; i < 32; i++) {
    normalized[i] = keyBuffer[i % keyBuffer.length];
  }
  
  return normalized;
}

const ENCRYPTION_KEY = normalizeKey(process.env.ENCRYPTION_KEY || 'your-fallback-encryption-key-32-chars');
const IV_LENGTH = 16; // Для AES это всегда 16 байт

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
} 