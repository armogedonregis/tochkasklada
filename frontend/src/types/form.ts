import { LucideIcon } from 'lucide-react';
import { Path } from 'react-hook-form';

export type IFormType = 'input' | 'select' | 'title' | 'checkbox';

export interface SelectOption {
  label: string;
  value: string | number;
}

// Базовые поля, общие для всех типов форм
interface BaseFormArea {
  label: string;
  icon?: LucideIcon;
  description?: string;
}

// Тип для input полей
interface InputFormArea<T> extends BaseFormArea {
  type: 'input';
  fieldName: Path<T>;
  placeholder?: string;
}

// Тип для select полей
interface SelectFormArea<T> extends BaseFormArea {
  type: 'select';
  fieldName: Path<T>;
  placeholder?: string;
  options: SelectOption[];
  isMulti?: boolean;
  isSearchable?: boolean;
}

// Тип для чекбоксов
interface CheckboxFormArea<T> extends BaseFormArea {
  type: 'checkbox';
  fieldName: Path<T>;
  description?: string;
}

// Тип для заголовков
interface TitleFormArea extends BaseFormArea {
  type: 'title';
  fieldName?: string; // Опционально для ключей
}

// Объединение всех типов
export type IForm<T> = InputFormArea<T> | SelectFormArea<T> | CheckboxFormArea<T> | TitleFormArea; 