import { LucideIcon } from 'lucide-react';
import { Path } from 'react-hook-form';

// Типы полей формы
export type IFormType = 
  | 'input' 
  | 'select' 
  | 'title' 
  | 'checkbox' 
  | 'searchSelect' 
  | 'checkboxWithSelect' 
  | 'colorPicker'
  | 'datePicker'
  | 'phoneInput';

// Опция для селектора
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Базовые поля, общие для всех типов форм
export interface BaseFormArea {
  label: string;
  icon?: LucideIcon;
  description?: string;
}

// Тип для input полей
export interface InputFormArea<T> extends BaseFormArea {
  type: 'input';
  fieldName: Path<T>;
  placeholder?: string;
  inputType?: string;
}

// Тип для select полей
export interface SelectFormArea<T> extends BaseFormArea {
  type: 'select';
  fieldName: Path<T>;
  placeholder?: string;
  options: SelectOption[];
  isMulti?: boolean;
  isSearchable?: boolean;
  onChange?: (value: string) => void;
}

// Тип для выпадающего списка с поиском и поддержкой RTK Query
export interface SearchSelectFormArea<T> extends BaseFormArea {
  type: 'searchSelect';
  fieldName: Path<T>;
  placeholder?: string;
  options: SelectOption[];  // Опции для отображения
  onSearch?: (query: string) => void;  // Функция, которая вызывается при изменении поискового запроса
  isMulti?: boolean;  // Опция для выбора нескольких значений
}

// Тип для чекбоксов
export interface CheckboxFormArea<T> extends BaseFormArea {
  type: 'checkbox';
  fieldName: Path<T>;
  description?: string;
}

// Тип для чекбоксов с селектором
export interface CheckboxWithSelectFormArea<T> extends BaseFormArea {
  type: 'checkboxWithSelect';
  fieldName: Path<T>;         // Имя поля для чекбокса
  selectField: Path<T>;       // Имя поля для селектора
  options: SelectOption[];    // Опции для селектора
  checkboxLabel?: string;     // Опциональная метка для чекбокса
  selectLabel?: string;       // Опциональная метка для селектора
}

// Тип для заголовков
export interface TitleFormArea extends BaseFormArea {
  type: 'title';
  fieldName?: string; // Опционально для ключей
}

// Тип для выбора цвета
export interface ColorPickerFormArea<T> extends BaseFormArea {
  type: 'colorPicker';
  fieldName: Path<T>;
  placeholder?: string;
  defaultValue?: string;
}

// Тип для выбора даты
export interface DatePickerFormArea<T> extends BaseFormArea {
  type: 'datePicker';
  fieldName: Path<T>;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

// Тип для ввода телефонного номера
export interface PhoneInputFormArea<T> extends BaseFormArea {
  type: 'phoneInput';
  fieldName: Path<T>;
  placeholder?: string;
  multiplePhones?: boolean; // Разрешить добавить несколько номеров
}

// Объединение всех типов
export type IForm<T> = 
  | InputFormArea<T> 
  | SelectFormArea<T> 
  | CheckboxFormArea<T> 
  | TitleFormArea
  | SearchSelectFormArea<T>
  | CheckboxWithSelectFormArea<T>
  | ColorPickerFormArea<T>
  | DatePickerFormArea<T>
  | PhoneInputFormArea<T>; 