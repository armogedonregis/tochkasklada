'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { SelectOption } from '@/types/form';

interface FormSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  onValueChange?: (value: string) => void;
}

const FormSelect = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder = 'Выберите значение',
  options,
  className = '',
  onValueChange
}: FormSelectProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              // Автоматическое преобразование для числовых значений
              const numValue = Number(value);
              if (!isNaN(numValue) && typeof field.value === 'number') {
                field.onChange(numValue);
              } else {
                field.onChange(value);
              }
              // Вызываем пользовательский обработчик, если он есть
              if (onValueChange) {
                onValueChange(value);
              }
            }}
            defaultValue={field.value !== undefined && field.value !== null 
              ? String(field.value) 
              : ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect; 