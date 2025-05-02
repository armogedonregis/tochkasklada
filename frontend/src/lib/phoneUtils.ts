/**
 * Утилиты для обработки телефонных номеров в различных форматах
 */

interface PhoneObject {
  id?: string;
  number?: string;
  phone?: string;
  [key: string]: any;
}

/**
 * Нормализует телефон любого формата (объект с number, объект с phone, строка)
 * в стандартный вид { id: string, number: string }
 */
export function normalizePhone(phone: any): { id: string; number: string } {
  // Если телефон не определен, создаем пустой
  if (phone === null || phone === undefined) {
    return { id: generateTempId(), number: '' };
  }

  // Если телефон - объект
  if (typeof phone === 'object' && phone !== null) {
    // Объект с полем number (новый формат)
    if ('number' in phone) {
      return { 
        id: phone.id || generateTempId(), 
        number: phone.number 
      };
    }
    // Объект с полем phone (старый формат)
    if ('phone' in phone) {
      return { 
        id: phone.id || generateTempId(), 
        number: phone.phone 
      };
    }
    
    // Неизвестный формат объекта
    return { 
      id: phone.id || generateTempId(), 
      number: String(phone.phone || phone.number || phone)
    };
  }
  
  // Если телефон - строка или другое примитивное значение
  return { 
    id: generateTempId(), 
    number: String(phone) 
  };
}

/**
 * Нормализует массив телефонов разных форматов
 * в стандартный массив { id: string, number: string }[]
 */
export function normalizePhones(phones: any[] | null | undefined): { id: string; number: string }[] {
  // Если массив телефонов не определен или пуст, возвращаем один пустой телефон
  if (!phones || !Array.isArray(phones) || phones.length === 0) {
    return [{ id: generateTempId(), number: '' }];
  }
  
  // Нормализуем каждый телефон в массиве
  return phones.map(normalizePhone);
}

/**
 * Преобразует массив телефонов в строку для отображения
 */
export function phonesToString(phones: any[] | null | undefined): string {
  if (!phones || !Array.isArray(phones) || phones.length === 0) {
    return '';
  }
  
  return normalizePhones(phones)
    .map(p => p.number)
    .filter(n => n && n.trim() !== '')
    .join(', ');
}

/**
 * Преобразует массив телефонов в массив строк для отправки на сервер
 */
export function phonesToStringArray(phones: any[] | null | undefined): string[] {
  if (!phones || !Array.isArray(phones) || phones.length === 0) {
    return [];
  }
  
  return normalizePhones(phones)
    .map(p => p.number)
    .filter(n => n && n.trim() !== '')
    .map(formatPhoneForSaving); // Форматируем номер перед сохранением
}

/**
 * Форматирует телефонный номер для сохранения,
 * приводя его к формату +7XXXXXXXXXX
 */
export function formatPhoneForSaving(phone: string): string {
  if (!phone) return '';
  
  // Удаляем все символы кроме цифр и плюса
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Если номер не начинается с +, добавляем +7
  if (!cleaned.startsWith('+')) {
    cleaned = '+7' + cleaned;
  }
  
  // Если номер начинается с +7 и за ним следует 8, удаляем 8
  // (распространенная ошибка: +78XXXXXXXXX вместо +7XXXXXXXXXX)
  if (cleaned.startsWith('+78') && cleaned.length > 3) {
    cleaned = '+7' + cleaned.substring(3);
  }
  
  return cleaned;
}

/**
 * Генерирует временный уникальный ID для новых телефонов
 */
export function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Форматирует телефонный номер для отображения
 * в формате +7 (XXX) XXX-XX-XX
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return '';
  
  phone = formatPhoneForSaving(phone);
  
  // Форматируем по шаблону
  const match = phone.match(/^\+7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})(.*)$/);
  
  if (!match) return phone;
  
  let result = '+7';
  
  if (match[1]) {
    result += ` (${match[1]}`;
    if (match[1].length === 3) result += ')';
  }
  
  if (match[2] && match[1].length === 3) {
    result += ` ${match[2]}`;
  }
  
  if (match[3] && match[2].length === 3) {
    result += `-${match[3]}`;
  }
  
  if (match[4] && match[3].length === 2) {
    result += `-${match[4]}`;
  }
  
  return result;
}

/**
 * Преобразует массив телефонов в строку форматированных номеров для отображения
 */
export function phonesToFormattedString(phones: any[] | null | undefined): string {
  if (!phones || !Array.isArray(phones) || phones.length === 0) {
    return '';
  }
  
  return normalizePhones(phones)
    .map(p => formatPhoneForDisplay(p.number))
    .filter(n => n && n.trim() !== '')
    .join(', ');
}

/**
 * Преобразует разные типы телефонов (строка, массив объектов, массив строк) 
 * в массив форматированных номеров телефонов
 */
export function parsePhonesString(phones: any): string[] {
  if (!phones) return [];
  
  // Если это строка телефонов, разделенных запятыми
  if (typeof phones === 'string') {
    return phones
      .split(',')
      .map(p => p.trim())
      .filter(p => p)
      .map(formatPhoneForSaving);
  }
  
  // Если это массив
  if (Array.isArray(phones)) {
    return phones
      .map(p => {
        if (typeof p === 'object' && p !== null) {
          // Объект с полем number или phone
          if ('number' in p) return p.number;
          if ('phone' in p) return p.phone;
          return String(p);
        }
        return String(p);
      })
      .filter(p => p)
      .map(formatPhoneForSaving);
  }
  
  return [];
} 