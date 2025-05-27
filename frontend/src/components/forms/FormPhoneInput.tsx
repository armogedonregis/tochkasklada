'use client';

import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormPhoneInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  multiplePhones?: boolean;
  onChange?: (value: string | string[]) => void;
}

const FormPhoneInput = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder = '+7 (___) ___-__-__',
  className = '',
  multiplePhones = false,
  onChange
}: FormPhoneInputProps<T>) => {
  // Для единичного номера или списка номеров
  const [phones, setPhones] = useState<string[]>([]);

  // Конфигурация маски для номера телефона
  const maskOptions = {
    mask: '+{7} (000) 000-00-00',
    lazy: false,
    placeholderChar: '_'
  };

  // При монтировании компонента или обновлении значения из формы
  useEffect(() => {
    const value = form.getValues(name);
    if (value) {
      if (multiplePhones && Array.isArray(value)) {
        setPhones(value);
      } else if (typeof value === 'string') {
        setPhones([value]);
      }
    } else {
      setPhones(multiplePhones ? [] : ['']);
    }
  }, [form, name, multiplePhones]);

  // Обновляем значение формы при изменении телефонов
  useEffect(() => {
    if (phones.length > 0) {
      if (multiplePhones) {
        // Используем any для обхода проверки типов, так как мы знаем, что структура данных соответствует форме
        form.setValue(name, phones as any, { shouldValidate: true });
      } else {
        // Если режим одного телефона, берем только первый
        form.setValue(name, phones[0] as any, { shouldValidate: true });
      }
    } else {
      // Если нет телефонов, устанавливаем пустое значение
      form.setValue(name, (multiplePhones ? [] : '') as any, { shouldValidate: true });
    }
  }, [phones, form, name, multiplePhones]);

  // Обработчик изменения значений телефонных номеров
  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
    
    if (onChange) {
      onChange(multiplePhones ? newPhones : newPhones[0]);
    }
  };

  // Обработчик добавления нового телефонного номера
  const handleAddPhone = () => {
    setPhones([...phones, '']);
  };

  // Обработчик удаления телефонного номера
  const handleRemovePhone = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
          
          <div className="space-y-2">
            {phones.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormControl>
                  <div className={cn(
                    "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-colors",
                    "focus-within:border-[#F62D40] focus-within:ring-1 focus-within:ring-[#F62D40] dark:focus-within:border-[#F8888F] dark:focus-within:ring-[#F8888F]"
                  )}>
                    <IMaskInput
                      {...maskOptions}
                      value={phone}
                      onAccept={(value) => {
                        // Сохраняем только цифры и +
                        const cleanValue = value.replace(/[^\d+]/g, '');
                        handlePhoneChange(index, cleanValue);
                      }}
                      placeholder={placeholder}
                      type="tel"
                      className="flex-1 h-full px-3 py-2 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </FormControl>
                
                {multiplePhones && phones.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePhone(index)}
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {multiplePhones && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPhone}
                className="mt-2 text-xs flex items-center gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Добавить телефон
              </Button>
            )}
          </div>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormPhoneInput; 