'use client';

import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormColorPickerProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const FormColorPicker = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder = 'Выберите цвет',
  className = '',
  defaultValue = '#000000',
  onChange
}: FormColorPickerProps<T>) => {
  const [color, setColor] = useState(defaultValue);

  // При монтировании компонента устанавливаем значение цвета из формы
  useEffect(() => {
    const formValue = form.getValues(name) || defaultValue;
    if (formValue) {
      setColor(formValue);
    }
  }, [form, name, defaultValue]);

  // Обработка изменения цвета
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("relative", className)}>
          <FormLabel>{label}</FormLabel>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden"
              style={{ backgroundColor: color }}
            />
            <FormControl>
              <Input
                {...field}
                type="color"
                placeholder={placeholder}
                value={color}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handleColorChange(e);
                }}
                className="w-full max-w-xs"
              />
            </FormControl>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {color}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormColorPicker; 