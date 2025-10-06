'use client';

import React from 'react';
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function PhoneInput({ value, onChange, className, error, ...props }: PhoneInputProps) {
  const maskOptions = {
    mask: '+{7} (000) 000-00-00',
    lazy: false,
    placeholderChar: '_'
  };

  const handleAccept = (value: string) => {
    const cleanValue = value.replace(/[^\d+]/g, '');
    onChange(cleanValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 11) {
      onChange('');
    }
    props.onBlur?.(e);
  };

  return (
    <IMaskInput
      {...maskOptions}
      value={value}
      onAccept={handleAccept}
      onBlur={handleBlur}
      placeholder="+7 (___) ___-__-__"
      type="tel"
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-[#F62D40] focus:ring-1 focus:ring-[#F62D40] dark:focus:border-[#F8888F] dark:focus:ring-[#F8888F] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
        className
      )}
      {...props}
    />
  );
} 