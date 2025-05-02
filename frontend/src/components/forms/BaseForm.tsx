'use client';

import React from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';
import { Input } from '@/components/ui/input';
import { IForm, IFormType } from '@/types/form';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface BaseFormProps<T extends FieldValues> {
  fields: IForm<T>[];
  validationSchema: ObjectSchema<any>;
  onSubmit: SubmitHandler<T>;
  renderButtons: (form: UseFormReturn<T>) => React.ReactNode;
  containerClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  defaultValues?: DefaultValues<T>;
}

const BaseForm = <T extends FieldValues>({
  fields,
  validationSchema,
  onSubmit,
  renderButtons,
  containerClassName = '',
  formClassName = '',
  inputClassName = '',
  defaultValues
}: BaseFormProps<T>) => {
  // Создаем defaultValues на основе полей, если они не были переданы
  const computedDefaultValues = React.useMemo(() => {
    if (defaultValues) return defaultValues;
    
    const values: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type === 'input') {
        values[field.fieldName] = '';
      } else if (field.type === 'select') {
        values[field.fieldName] = '';
      } else if (field.type === 'checkbox') {
        values[field.fieldName] = false;
      }
    });
    
    return values as DefaultValues<T>;
  }, [fields, defaultValues]);
  
  const form = useForm<T>({
    resolver: yupResolver(validationSchema),
    defaultValues: computedDefaultValues
  });

  const renderFormField = (item: IForm<T>) => {
    switch (item.type) {
      case 'input':
        return (
          <FormField
            key={item.fieldName}
            control={form.control}
            name={item.fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <div className="relative">
                    {item.icon && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {React.createElement(item.icon, {
                          className: "h-5 w-5 text-gray-400"
                        })}
                      </div>
                    )}
                    <Input
                      placeholder={item.placeholder}
                      className={item.icon ? 'pl-10' : ''}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'select':
        return (
          <FormField
            key={item.fieldName}
            control={form.control}
            name={item.fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    // Автоматическое преобразование для числовых значений
                    const numValue = Number(value);
                    if (!isNaN(numValue) && typeof field.value === 'number') {
                      field.onChange(numValue);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  defaultValue={field.value !== undefined && field.value !== null 
                    ? String(field.value) 
                    : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={item.placeholder || 'Выберите значение'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {item.options.map((option) => (
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
      
      case 'checkbox':
        return (
          <FormField
            key={item.fieldName}
            control={form.control}
            name={item.fieldName}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{item.label}</FormLabel>
                  {item.description && (
                    <FormDescription>{item.description}</FormDescription>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        );
      
      case 'title':
        return (
          <h4 key={item.fieldName || `title-${item.label}`} className="text-gray-900 dark:text-white py-5 font-bold text-base">
            {item.label}
          </h4>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={containerClassName}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={formClassName}>
          <div className={inputClassName}>
            {fields.map(renderFormField)}
          </div>
          {renderButtons(form)}
        </form>
      </Form>
    </div>
  );
};

export default BaseForm; 