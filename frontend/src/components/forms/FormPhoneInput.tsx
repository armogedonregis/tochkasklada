'use client';

import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneData {
  phone: string;
  comment?: string;
}

interface FormPhoneInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  multiplePhones?: boolean;
  onChange?: (value: PhoneData | PhoneData[]) => void;
  comment?: boolean;
}

const FormPhoneInput = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder = '+7 (___) ___-__-__',
  className = '',
  multiplePhones = false,
  comment = false,
  onChange
}: FormPhoneInputProps<T>) => {
  const [phones, setPhones] = useState<PhoneData[]>([]);
  const initialized = React.useRef(false);

  // Инициализация только при первом рендере или смене клиента
  useEffect(() => {
    if (!initialized.current) {
      const value = form.getValues(name);
      if (value) {
        if (multiplePhones && Array.isArray(value)) {
          // Если это массив объектов с phone и comment
          if (value.length > 0 && typeof value[0] === 'object' && 'phone' in value[0]) {
            setPhones(value as PhoneData[]);
          } else {
            // Если это массив строк, конвертируем в объекты
            setPhones(value.map((phone: string) => ({ phone })));
          }
        } else if (typeof value === 'string') {
          setPhones([{ phone: value }]);
        } else if (typeof value === 'object' && 'phone' in value) {
          setPhones([value as PhoneData]);
        }
      } else {
        setPhones(multiplePhones ? [] : [{ phone: '' }]);
      }
      initialized.current = true;
    }
    // eslint-disable-next-line
  }, [form, name, multiplePhones]);

  // Синхронизация с формой только при изменении phones пользователем
  useEffect(() => {
    if (!initialized.current) return; // Пропускаем первый рендер
    if (phones.length > 0) {
      if (multiplePhones) {
        form.setValue(name, phones as any, { shouldValidate: true });
      } else {
        // В режиме одного телефона пишем в форму строку, не объект
        form.setValue(name, (phones[0]?.phone || '') as any, { shouldValidate: true });
      }
    } else {
      form.setValue(name, (multiplePhones ? [] : '') as any, { shouldValidate: true });
    }
    // eslint-disable-next-line
  }, [phones]);

  const maskOptions = {
    mask: '+{7} (000) 000-00-00',
    lazy: true,
    placeholderChar: '_'
  };

  // Обработчик изменения значений телефонных номеров
  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = { ...newPhones[index], phone: value };
    setPhones(newPhones);

    if (onChange) {
      onChange(multiplePhones ? newPhones : (newPhones[0]?.phone as any));
    }
  };

  // Обработчик изменения комментариев
  const handleCommentChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = { ...newPhones[index], comment: value };
    setPhones(newPhones);

    if (onChange) {
      onChange(multiplePhones ? newPhones : (newPhones[0]?.phone as any));
    }
  };

  // Обработчик добавления нового телефонного номера
  const handleAddPhone = () => {
    setPhones([...phones, { phone: '', comment: '' }]);
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

          <div className="space-y-3">
            {phones.map((phoneData, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <div className={cn(
                      "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-colors",
                      "focus-within:border-[#F62D40] focus-within:ring-1 focus-within:ring-[#F62D40] dark:focus-within:border-[#F8888F] dark:focus-within:ring-[#F8888F]"
                    )}>
                      <IMaskInput
                        {...maskOptions}
                        value={phoneData.phone}
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

                {comment && (
                  <FormControl>
                    <Input
                      value={phoneData.comment || ''}
                      onChange={(e) => handleCommentChange(index, e.target.value)}
                      placeholder="Комментарий к номеру (необязательно)"
                      className="h-8 text-sm"
                    />
                  </FormControl>
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