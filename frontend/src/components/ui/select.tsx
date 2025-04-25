'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  disabled, 
  children 
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child as React.ReactElement<SelectTriggerProps>, {
            onClick: () => !disabled && setOpen(!open),
            disabled
          });
        }
        if (React.isValidElement(child) && child.type === SelectContent) {
          return open && !disabled ? child : null;
        }
        return child;
      })}
    </div>
  );
};

export interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({ 
  className, 
  children, 
  disabled,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-red-500 focus-within:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex items-center justify-between cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const SelectContent: React.FC<SelectContentProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "absolute z-50 w-full mt-1 py-1 border border-gray-300 rounded-md bg-white shadow-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white max-h-60 overflow-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

const SelectItem: React.FC<SelectItemProps> = ({ 
  className, 
  children, 
  value,
  ...props 
}) => {
  const context = React.useContext(SelectContext);
  
  const isSelected = context.value === value;
  
  const handleClick = () => {
    if (context.onValueChange) {
      context.onValueChange(value);
    }
  };
  
  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={cn(
        "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
        isSelected && "bg-gray-100 dark:bg-gray-600",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

const SelectValue: React.FC<SelectValueProps> = ({ 
  className, 
  children, 
  placeholder, 
  ...props 
}) => {
  return (
    <span
      className={cn(
        "block truncate",
        className
      )}
      {...props}
    >
      {children || placeholder}
    </span>
  );
};

// Создаем контекст для передачи value и onValueChange
interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType>({});

// Обновляем компонент Select для предоставления контекста
const SelectProvider: React.FC<SelectProps> = (props) => {
  return (
    <SelectContext.Provider value={{ value: props.value, onValueChange: props.onValueChange }}>
      <Select {...props} />
    </SelectContext.Provider>
  );
};

export { SelectProvider as Select, SelectTrigger, SelectContent, SelectItem, SelectValue }; 