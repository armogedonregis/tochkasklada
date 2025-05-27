'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

interface FormCheckboxProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const FormCheckbox = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  onCheckedChange
}: FormCheckboxProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-row items-center space-x-3 space-y-0 p-2`}>
          <FormControl>
            <Checkbox
              checked={field.value ?? false}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (onCheckedChange) {
                  onCheckedChange(!!checked);
                }
              }}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            {description && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormCheckbox; 