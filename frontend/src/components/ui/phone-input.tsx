'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function PhoneInput({ value, onChange, className, error, ...props }: PhoneInputProps) {
  // Обработчик изменения телефона
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Удаляем все символы кроме цифр и +
    newValue = newValue.replace(/[^0-9+]/g, '');
    
    // Если значение пустое и первый вводимый символ не +
    if (!value && newValue && !newValue.startsWith('+')) {
      newValue = '+7' + newValue;
    }
    
    // Если начинается с +7 и следом идет 8, то удаляем 8
    if (newValue.startsWith('+78') && newValue.length > 3) {
      newValue = '+7' + newValue.substring(3);
    }
    
    onChange(newValue);
  };

  // Форматируем телефонный номер для отображения
  const formatPhoneDisplay = (phone: string): string => {
    if (!phone) return '';
    
    // +7 (XXX) XXX-XX-XX
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
  };

  return (
    <Input
      type="tel"
      value={formatPhoneDisplay(value)}
      onChange={handleChange}
      className={cn(error ? 'border-red-500' : '', className)}
      placeholder="+7 (___) ___-__-__"
      {...props}
    />
  );
} 