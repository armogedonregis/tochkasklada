import { LucideIcon } from 'lucide-react';
import { Path } from 'react-hook-form';

export type IFormType = 'input' | 'select' | 'title' | 'checkbox' | 'searchSelect' | 'checkboxWithSelect';

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
  inputType?: string;
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

// Тип для выпадающего списка с поиском и поддержкой RTK Query
interface SearchSelectFormArea<T> extends BaseFormArea {
  type: 'searchSelect';
  fieldName: Path<T>;
  placeholder?: string;
  options: SelectOption[];  // Опции для отображения
  onSearch?: (query: string) => void;  // Функция, которая вызывается при изменении поискового запроса
  isMulti?: boolean;  // Опция для выбора нескольких значений
}

// Тип для чекбоксов
interface CheckboxFormArea<T> extends BaseFormArea {
  type: 'checkbox';
  fieldName: Path<T>;
  description?: string;
}

// Тип для чекбоксов с селектором
interface CheckboxWithSelectFormArea<T> extends BaseFormArea {
  type: 'checkboxWithSelect';
  fieldName: Path<T>;         // Имя поля для чекбокса
  selectField: Path<T>;       // Имя поля для селектора
  options: SelectOption[];    // Опции для селектора
  checkboxLabel?: string;     // Опциональная метка для чекбокса
  selectLabel?: string;       // Опциональная метка для селектора
}

// Тип для заголовков
interface TitleFormArea extends BaseFormArea {
  type: 'title';
  fieldName?: string; // Опционально для ключей
}

// Объединение всех типов
export type IForm<T> = 
  | InputFormArea<T> 
  | SelectFormArea<T> 
  | CheckboxFormArea<T> 
  | TitleFormArea
  | SearchSelectFormArea<T>
  | CheckboxWithSelectFormArea<T>; 