import React from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectOption } from '@/types/form';

interface FormCheckboxWithSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  selectField: Path<T>;
  label?: string;
  checkboxLabel?: string;
  selectLabel?: string;
  options: SelectOption[];
}

const FormCheckboxWithSelect = <T extends FieldValues>({
  form,
  name,
  selectField,
  checkboxLabel = '',
  options
}: FormCheckboxWithSelectProps<T>) => {
  // Получаем значение чекбокса из формы
  const isChecked = form.watch(name);

  return (
    <div className="py-0.5">
      <div className="flex items-center gap-2">
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-1 space-y-0 min-w-[100px]">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="w-3.5 h-3.5"
                />
              </FormControl>
              {checkboxLabel && (
                <FormLabel className="text-xs font-medium cursor-pointer">
                  {checkboxLabel}
                </FormLabel>
              )}
            </FormItem>
          )}
        />

        <div className={`flex-1 transition-opacity ${isChecked ? 'opacity-100' : 'opacity-50'}`}>
          <FormField
            control={form.control}
            name={selectField}
            render={({ field }) => (
              <FormItem className="flex-1 m-0">
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!isChecked}
                >
                  <FormControl>
                    <SelectTrigger className="h-7 text-xs min-h-0 py-0">
                      <SelectValue placeholder="Размер" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem 
                        key={option.value.toString()} 
                        value={option.value.toString()}
                        className="text-xs py-1"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FormCheckboxWithSelect; 