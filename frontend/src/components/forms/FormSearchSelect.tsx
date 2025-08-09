'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { SelectOption } from '@/types/form';
import AsyncSelect from 'react-select/async';
import { MultiValue, SingleValue } from 'react-select';

interface FormSearchSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options?: SelectOption[];
  isMulti?: boolean;
  className?: string;
  onSearch?: (query: string) => void | Promise<void | SelectOption[]> | Promise<SelectOption[]>;
  onChange?: (value: string | string[] | null) => void;
}

const FormSearchSelect = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder = 'Поиск...',
  options,
  isMulti = false,
  className = '',
  onSearch,
  onChange
}: FormSearchSelectProps<T>) => {
  const [selectedOption, setSelectedOption] = useState<SelectOption | SelectOption[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Следим за значением поля и опциями, чтобы корректно отрисовать дефолт
  useEffect(() => {
    const currentValue: any = form.getValues(name);
    const hasOptions = Array.isArray(options) && options.length > 0;

    // Нормализуем значения формы и выбранного состояния
    const currentValuesArray = isMulti
      ? (Array.isArray(currentValue) ? currentValue.map(String) : [])
      : (currentValue != null ? [String(currentValue)] : []);

    const selectedValuesArray = (() => {
      if (!selectedOption) return [] as string[];
      if (Array.isArray(selectedOption)) return selectedOption.map(o => String(o.value));
      return [String(selectedOption.value)];
    })();

    // Если выбранное состояние уже соответствует значению формы, ничего не делаем
    const isSameSelection = currentValuesArray.length === selectedValuesArray.length &&
      currentValuesArray.every((val, idx) => val === selectedValuesArray[idx]);
    if (isSameSelection) {
      return;
    }

    // Если значения пустые — сбрасываем
    if (!currentValuesArray.length) {
      setSelectedOption(null);
      return;
    }

    // Если опций ещё нет — не затираем текущее выбранное состояние
    if (!hasOptions) {
      return;
    }

    // Маппим значения формы к опциям из props
    if (isMulti) {
      const mapped = currentValuesArray
        .map(val => options.find(opt => String(opt.value) === String(val)))
        .filter(Boolean) as SelectOption[];
      if (mapped.length) setSelectedOption(mapped);
    } else {
      const mapped = options.find(opt => String(opt.value) === String(currentValuesArray[0])) || null;
      setSelectedOption(mapped);
    }
  }, [form, name, isMulti, form.watch(name), options]);

  // Реакция на внешнее обновление options – только для отображения предзагруженных/предвыбранных значений

  // Функция загрузки опций: источник один – промис от onSearch
  const loadOptions = useCallback((inputValue: string) => {
    setIsLoading(true);
    if (!onSearch) {
      setIsLoading(false);
      return Promise.resolve(options || []);
    }
    return Promise.resolve(onSearch(inputValue ?? '')).then((res) => {
      // Если обработчик вернул готовые опции – используем их
      if (Array.isArray(res)) return res;
      // Иначе полагаемся на внешние props.options, чтобы не ломать совместимость
      return options || [];
    }).finally(() => setIsLoading(false));
  }, [onSearch, options]);

  // Отключаем клиентскую фильтрацию — доверяем источнику options
  const filterOption = useCallback(() => true, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Обработчик изменения значения
        const handleChange = (
          option: MultiValue<SelectOption> | SingleValue<SelectOption>
        ) => {
          if (isMulti) {
            // Для множественного выбора (MultiValue - это readonly array)
            const multiOptions = option as MultiValue<SelectOption>;
            if (multiOptions.length) {
              const values = multiOptions.map(opt => String(opt.value));
              field.onChange(values as any);
              if (onChange) onChange(values);
              setSelectedOption([...multiOptions]);
            } else {
              field.onChange([] as any);
              if (onChange) onChange([]);
              setSelectedOption(null);
            }
          } else {
            // Для одиночного выбора
            const singleOption = option as SingleValue<SelectOption>;
            const value = singleOption ? String(singleOption.value) : null;
            field.onChange(value as any);
            if (onChange) onChange(value);
            setSelectedOption(singleOption);
          }
        };

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <AsyncSelect
                inputId={String(name)}
                name={String(name)}
                loadOptions={loadOptions}
                cacheOptions={false}
                defaultOptions={true}
                onInputChange={(val) => val}
                filterOption={filterOption}
                value={selectedOption}
                onChange={handleChange}
                onBlur={field.onBlur}
                isMulti={isMulti}
                placeholder={placeholder}
                isClearable
                isLoading={isLoading}
                loadingMessage={() => "Загрузка..."}
                noOptionsMessage={() => "Ничего не найдено"}
                classNamePrefix="select"
                classNames={{
                  control: (state) => (
                    state.isFocused ? "focus:border-[#F62D40] focus:ring-1 focus:ring-[#F62D40] dark:focus:border-[#F8888F] dark:focus:ring-[#F8888F] focus:outline-none" : "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                  ),
                  input: () => 'py-2 text-sm text-gray-900 dark:text-white',
                  singleValue: () => 'py-2 text-sm text-gray-900 dark:text-white',
                  placeholder: () => 'py-2 text-sm text-gray-900 dark:text-white',
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    height: '40px',
                    background: "transparent",
                    borderRadius: '0.375rem',
                    padding: '2px',
                    backgroundColor: 'white', 
                    minHeight: '40px',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected 
                      ? '#F62D40' 
                      : state.isFocused 
                        ? '#FFF1F2' 
                        : 'transparent',
                    color: state.isSelected ? 'white' : '#1E293B',
                    fontSize: '0.875rem',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    ':active': {
                      backgroundColor: '#F62D40',
                      color: 'white',
                    }
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#FFF1F2',
                    borderRadius: '0.25rem',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#F62D40',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#F62D40',
                    ':hover': {
                      backgroundColor: '#F62D40',
                      color: 'white',
                    },
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: '#94A3B8',
                    padding: '0 8px',
                    ':hover': {
                      color: '#64748B',
                    }
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: '#94A3B8',
                    padding: '0 8px',
                    ':hover': {
                      color: '#64748B',
                    }
                  }),
                  indicatorSeparator: (base) => ({
                    ...base,
                    backgroundColor: '#E2E8F0',
                  }),
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormSearchSelect; 