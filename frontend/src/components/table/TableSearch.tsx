import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

// Хук для debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface TableSearchProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function TableSearch({ 
  placeholder = 'Поиск...', 
  onSearch,
  debounceMs = 300 
}: TableSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, debounceMs);

  // Применяем debounced поиск
  useEffect(() => {
    onSearch(debouncedSearchValue);
  }, [debouncedSearchValue, onSearch]);

  return (
    <div className="flex-1 max-w-md">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="w-full"
        />
        {searchValue && (
          <button 
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
} 