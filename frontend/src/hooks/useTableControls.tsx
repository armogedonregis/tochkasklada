import { useState, useCallback, useMemo, useRef } from 'react';
import { SortingState, PaginationState } from '@tanstack/react-table';
import { SortDirection } from '@/types/common.types';

interface TableControlsOptions<SortField extends string> {
  defaultPageSize?: number;
  defaultPageIndex?: number;
  defaultSorting?: SortingState;
  defaultSearch?: string;
  searchDebounceMs?: number; // Время задержки для поиска в миллисекундах
}

/**
 * Хук для управления состоянием таблицы (сортировка, пагинация, поиск)
 */
export function useTableControls<SortField extends string>(
  options: TableControlsOptions<SortField> = {}
) {
  const {
    defaultPageSize = 10,
    defaultPageIndex = 0,
    defaultSorting = [],
    defaultSearch = '',
    searchDebounceMs = 300, // Задержка по умолчанию - 300 мс
  } = options;

  // Состояния
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [search, setSearch] = useState(defaultSearch);
  
  // Ref для хранения таймера debounce
  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Преобразование состояния сортировки в формат API
  const getSortParams = useCallback((sorting: SortingState): { sortBy?: SortField; sortDirection?: SortDirection } => {
    if (!sorting.length) return {};
    const sortField = sorting[0].id as SortField;
    const sortDirection = sorting[0].desc ? SortDirection.DESC : SortDirection.ASC;
    return {
      sortBy: sortField,
      sortDirection,
    };
  }, []);

  // Получение параметров запроса
  const getQueryParams = useCallback(() => {
    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search.trim(),
      ...getSortParams(sorting),
    };
  }, [pagination, search, sorting, getSortParams]);

  // Используем useMemo для кэширования результата getQueryParams
  const queryParams = useMemo(() => getQueryParams(), [getQueryParams]);

  // Обработчики
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
  }, []);

  const handlePaginationChange = useCallback((newPagination: PaginationState) => {
    setPagination(newPagination);
  }, []);

  const handleSearchChange = useCallback((newSearch: string) => {
    // Очищаем предыдущий таймер
    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }
    
    // Устанавливаем новый таймер для задержки
    searchDebounceTimerRef.current = setTimeout(() => {
      // Обновляем только если значение действительно изменилось
      if (search !== newSearch) {
        setSearch(newSearch);
        // При изменении поискового запроса возвращаемся на первую страницу
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
      }
      searchDebounceTimerRef.current = null;
    }, searchDebounceMs);
  }, [search, searchDebounceMs]);

  // Сброс всех фильтров
  const resetFilters = useCallback(() => {
    setPagination({
      pageIndex: defaultPageIndex,
      pageSize: defaultPageSize,
    });
    setSorting(defaultSorting);
    setSearch(defaultSearch);
  }, [defaultPageIndex, defaultPageSize, defaultSorting, defaultSearch]);

  return {
    // Состояния
    pagination,
    sorting,
    search,
    
    // Параметры запроса
    queryParams,
    
    // Обработчики
    handleSortingChange,
    handlePaginationChange,
    handleSearchChange,
    resetFilters,
    
    // Вспомогательные функции
    getSortParams,
  };
} 