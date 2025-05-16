'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface FormInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
  type?: string;
}

const FormInput = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  icon,
  className = '',
  type = 'text'
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {React.createElement(icon, {
                    className: "h-5 w-5 text-gray-400"
                  })}
                </div>
              )}
              <Input
                placeholder={placeholder}
                className={icon ? 'pl-10' : ''}
                {...field}
                value={field.value ?? ''}
                type={type}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput; 