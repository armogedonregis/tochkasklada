'use client';

import React from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';
import { IForm } from '@/components/forms/types';
import { Form } from '@/components/ui/form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormCheckbox from './FormCheckbox';
import FormTitle from './FormTitle';
import FormSearchSelect from './FormSearchSelect';
import FormCheckboxWithSelect from './FormCheckboxWithSelect';
import FormColorPicker from './FormColorPicker';
import FormDatePicker from './FormDatePicker';
import FormPhoneInput from './FormPhoneInput';

interface BaseFormProps<T extends FieldValues> {
  fields: IForm<T>[];
  validationSchema: ObjectSchema<any>;
  onSubmit: SubmitHandler<T>;
  renderButtons: (form: UseFormReturn<T>) => React.ReactNode;
  containerClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  defaultValues?: DefaultValues<T>;
  isCheckBoxWithSelectMulty?: boolean;
}

const BaseForm = <T extends FieldValues>({
  fields,
  validationSchema,
  onSubmit,
  renderButtons,
  containerClassName = '',
  formClassName = '',
  inputClassName = '',
  defaultValues,
  isCheckBoxWithSelectMulty = false
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
      } else if (field.type === 'colorPicker') {
        values[field.fieldName] = field.defaultValue || '#000000';
      } else if (field.type === 'datePicker') {
        values[field.fieldName] = null;
      } else if (field.type === 'phoneInput') {
        values[field.fieldName] = field.multiplePhones ? [] : '';
      } else if (field.type === 'checkboxWithSelect') {
        values[field.fieldName] = false; 
        if (field.selectField) {
          values[field.selectField] = ''; 
        }  
      }
    });
    
    return values as DefaultValues<T>;
  }, [fields, defaultValues]);
  
  const form = useForm<T>({
    resolver: yupResolver(validationSchema),
    defaultValues: computedDefaultValues
  });

  const { regularFields, checkboxWithSelectFields } = React.useMemo(() => {
    if (!isCheckBoxWithSelectMulty) {
      return { regularFields: fields, checkboxWithSelectFields: [] };
    }

    return fields.reduce((acc, field) => {
      if (field.type === 'checkboxWithSelect') {
        acc.checkboxWithSelectFields.push(field);
      } else {
        acc.regularFields.push(field);
      }
      return acc;
    }, { regularFields: [] as IForm<T>[], checkboxWithSelectFields: [] as IForm<T>[] });
  }, [fields, isCheckBoxWithSelectMulty]);

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
            type={item.inputType}
            className={inputClassName}
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
            className={inputClassName}
            onValueChange={item.onChange}
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
            className={inputClassName}
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
            className={inputClassName}
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
      
      case 'colorPicker':
        return (
          <FormColorPicker
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            label={item.label}
            placeholder={item.placeholder}
            description={item.description}
            defaultValue={item.defaultValue}
            className={inputClassName}
          />
        );
      
      case 'datePicker':
        return (
          <FormDatePicker
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            label={item.label}
            placeholder={item.placeholder}
            description={item.description}
            minDate={item.minDate}
            maxDate={item.maxDate}
            className={inputClassName}
          />
        );
      
      case 'phoneInput':
        return (
          <FormPhoneInput
            key={item.fieldName}
            form={form}
            name={item.fieldName}
            label={item.label}
            placeholder={item.placeholder}
            description={item.description}
            multiplePhones={item.multiplePhones}
            className={inputClassName}
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
          <div className="space-y-4">
            {regularFields.map(renderFormField)}

            {isCheckBoxWithSelectMulty && checkboxWithSelectFields.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {checkboxWithSelectFields.map(renderFormField)}
              </div>
            )}
          </div>
          {renderButtons(form)}
        </form>
      </Form>
    </div>
  );
};

export default BaseForm; 