'use client';

import React from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';
import { IForm } from '@/types/form';
import { Form } from '@/components/ui/form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormCheckbox from './FormCheckbox';
import FormTitle from './FormTitle';
import FormSearchSelect from './FormSearchSelect';
import FormCheckboxWithSelect from './FormCheckboxWithSelect';

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
      } else if (field.type === 'searchSelect') {
        values[field.fieldName] = null;
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
          <FormInput
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            label={item.label}
            placeholder={item.placeholder}
            icon={item.icon}
          />
        );
      
      case 'select':
        return (
          <FormSelect
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            label={item.label}
            placeholder={item.placeholder}
            options={item.options}
          />
        );
      
      case 'searchSelect':
        return (
          <FormSearchSelect
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            label={item.label}
            placeholder={item.placeholder}
            options={item.options || []}
            isMulti={item.isMulti}
            onSearch={item.onSearch}
          />
        );
      
      case 'checkbox':
        return (
          <FormCheckbox
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            label={item.label}
            description={item.description}
          />
        );
      
      case 'checkboxWithSelect':
        return (
          <FormCheckboxWithSelect
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            selectField={item.selectField}
            label={item.label}
            checkboxLabel={item.checkboxLabel}
            selectLabel={item.selectLabel}
            options={item.options}
          />
        );
      
      case 'title':
        return (
          <FormTitle
            key={item.fieldName || `title-${item.label}`}
            label={item.label}
          />
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