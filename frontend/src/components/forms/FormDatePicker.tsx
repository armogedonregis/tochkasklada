'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FormDatePickerProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | undefined) => void;
}

const FormDatePicker = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder = 'Выберите дату',
  className = '',
  minDate,
  maxDate,
  onChange
}: FormDatePickerProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), 'dd MMMM yyyy', { locale: ru })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date: Date | undefined) => {
                  field.onChange(date);
                  if (onChange) onChange(date);
                }}
                disabled={(date: Date) => {
                  // Отключаем даты до минимальной даты
                  if (minDate && date < minDate) {
                    return true;
                  }
                  // Отключаем даты после максимальной даты
                  if (maxDate && date > maxDate) {
                    return true;
                  }
                  return false;
                }}
                initialFocus
                locale={ru}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDatePicker; 