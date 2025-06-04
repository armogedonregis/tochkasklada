import React, { useState, CSSProperties } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  Row,
  VisibilityState,
  PaginationState,
  ColumnOrderState,
  Header,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableSearch } from './TableSearch';
import { TableColumnSettings } from './TableColumnSettings';
import { TablePagination } from './TablePagination';
import { TableErrorState, TableLoadingOverlay, TableEmptyState } from './TableStates';
import { TableActions } from './TableActions';
import {
  ArrowUpDown,
  Move,
  GripVertical,
  ArrowDown,
  ArrowUp,
  ArrowDownUp,
} from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

// Компонент для перетаскиваемого заголовка колонки
function DraggableColumnHeader<TData>({
  header,
  isReorderingEnabled,
  isResizingEnabled,
}: {
  header: Header<TData, unknown>;
  isReorderingEnabled: boolean;
  isResizingEnabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: header.id,
    disabled: !isReorderingEnabled,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition: isReorderingEnabled ? 'width transform 0.2s ease-in-out' : undefined,
    zIndex: isDragging ? 10 : 0,
    width: header.getSize(),
  };

  const canSort = header.column.getCanSort();

  return (
    <TableHead
      ref={isReorderingEnabled ? setNodeRef : undefined}
      key={header.id}
      style={style}
      className={`
        bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium
        ${isReorderingEnabled ? 'cursor-move' : ''}
        relative ${canSort && !isReorderingEnabled ? 'cursor-pointer select-none' : ''}
      `}
      onClick={canSort && !isReorderingEnabled
        ? header.column.getToggleSortingHandler()
        : undefined}
      {...(isReorderingEnabled ? { ...attributes, ...listeners } : {})}
    >
      <div className="flex items-center py-3 group">
        {isReorderingEnabled && (
          <span className="mr-2 text-gray-400 flex-shrink-0">
            <GripVertical className="h-4 w-4" />
          </span>
        )}
        {header.isPlaceholder
          ? null
          : flexRender(
            header.column.columnDef.header,
            header.getContext()
          )}

        {/* Визуализация состояния сортировки */}
        {header.column.getIsSorted() ? (
          <span className="ml-1 flex-shrink-0">
            {header.column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </span>
        ) : (
          // Показываем иконку для сортируемых колонок
          canSort && (
            <span className="ml-1 text-gray-400 flex-shrink-0">
              <ArrowDownUp className="h-3.5 w-3.5" />
            </span>
          )
        )}
      </div>
      {/* Возможность изменения размера колонки */}
      {isResizingEnabled && header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none ${header.column.getIsResizing() ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </TableHead>
  );
}

// Упрощенный интерфейс для TableBase
interface BaseTableProps<TData, TSortField extends string = string> {
  // Данные и колонки
  data: TData[];
  columns: ColumnDef<TData, any>[];

  // Поиск
  searchColumn?: string;
  searchPlaceholder?: string;

  // Действия
  onRowClick?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  disableActions?: boolean;

  // Пагинация и сортировка
  isDisabledPagination?: boolean;
  isDisabledSorting?: boolean;
  pagination?: PaginationState;
  sorting?: SortingState;
  totalCount?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onSearchChange?: (search: string) => void;

  // Состояния
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;

  // Дополнительные настройки
  sortableFields?: Record<TSortField, string>;
  tableId?: string;
  className?: string;
  renderRowSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;

  // Настройки сохранения
  persistSettings?: boolean;
  defaultColumnOrder?: string[];
}

export function BaseTable<TData, TSortField extends string = string>({
  // Данные и колонки
  data,
  columns,

  // Поиск
  searchColumn,
  searchPlaceholder = 'Поиск...',

  // Действия
  onRowClick,
  onEdit,
  onDelete,
  disableActions = false,

  // Пагинация и сортировка
  isDisabledPagination = false,
  isDisabledSorting = false,
  pagination,
  sorting,
  totalCount = 0,
  pageCount = 0,
  onPaginationChange,
  onSortingChange,
  onSearchChange,

  // Состояния
  isLoading = false,
  error = null,
  onRetry,

  // Дополнительные настройки
  sortableFields,
  tableId = 'table',
  className = '',
  renderRowSubComponent,

  // Настройки сохранения
  persistSettings = true,
  defaultColumnOrder,
}: BaseTableProps<TData, TSortField>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isReorderingEnabled, setIsReorderingEnabled] = useState(false);
  const [isResizingEnabled, setIsResizingEnabled] = useState(false);

  // Получаем сохраненный ранее порядок колонок из localStorage
  const getSavedColumnOrder = (): string[] | undefined => {
    if (typeof window !== 'undefined' && persistSettings) {
      const savedOrder = localStorage.getItem(`${tableId}-column-order`);
      return savedOrder ? JSON.parse(savedOrder) : undefined;
    }
    return undefined;
  };

  // Получаем сохраненную видимость колонок
  const getSavedColumnVisibility = (): VisibilityState | undefined => {
    if (typeof window !== 'undefined' && persistSettings) {
      const savedVisibility = localStorage.getItem(`${tableId}-column-visibility`);
      return savedVisibility ? JSON.parse(savedVisibility) : undefined;
    }
    return undefined;
  };

  // Получаем сохраненные размеры колонок
  const getSavedColumnSizes = (): Record<string, number> | undefined => {
    if (typeof window !== 'undefined' && persistSettings) {
      const savedSizes = localStorage.getItem(`${tableId}-column-sizes`);
      return savedSizes ? JSON.parse(savedSizes) : undefined;
    }
    return undefined;
  };

  // Инициализация порядка колонок
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() => {
    return getSavedColumnOrder() || defaultColumnOrder || columns.map(col => {
      if (typeof col.id === 'string') return col.id;
      if ('accessorKey' in col) {
        return String(col.accessorKey);
      }
      return '';
    }).filter(id => id !== '');
  });

  // Сохраняем размеры колонок
  const [columnSizes, setColumnSizes] = useState<Record<string, number>>({});

  // Инициализация видимости и размеров колонок из localStorage при монтировании
  React.useEffect(() => {
    const savedVisibility = getSavedColumnVisibility();
    if (savedVisibility) {
      setColumnVisibility(savedVisibility);
    }

    const savedSizes = getSavedColumnSizes();
    if (savedSizes) {
      setColumnSizes(savedSizes);
    }
  }, []);

  // Функция для проверки, поддерживает ли поле сортировку
  const isSortable = (key: string): boolean => {
    if (!sortableFields) return true;
    return Object.values(sortableFields).includes(key);
  };

  // Настройка сенсоров для DnD
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  // Применяем enableSorting на основе sortableFields
  const columnsWithSorting = React.useMemo(() => {
    if (!sortableFields) return columns;

    return columns.map(column => {
      const accessorKey = 'accessorKey' in column && typeof column.accessorKey === 'string'
        ? column.accessorKey
        : undefined;
      const id = column.id || accessorKey;

      if (!id) return column;

      return {
        ...column,
        enableSorting: isSortable(id)
      };
    });
  }, [columns, sortableFields]);

  // Добавляем колонку с действиями, если они не отключены и есть обработчики
  const columnsWithActions = React.useMemo(() => {
    if (!disableActions && onEdit && onDelete) {
      const hasActionsColumn = columnsWithSorting.some(column => {
        return (typeof column.id === 'string' && column.id === 'actions') ||
          ('accessorKey' in column && typeof column.accessorKey === 'string' && column.accessorKey === 'actions');
      });

      if (!hasActionsColumn) {
        return [
          ...columnsWithSorting,
          {
            id: 'actions',
            header: 'Действия',
            cell: ({ row }) => (
              <TableActions
                onEdit={() => onEdit(row.original)}
                onDelete={() => onDelete(row.original)}
              />
            ),
          },
        ];
      }
    }
    return columnsWithSorting;
  }, [columnsWithSorting, disableActions, onEdit, onDelete]);

  // Настройка колонок для изменения размера с использованием сохраненных размеров
  const columnsWithResize = React.useMemo(() => {
    return columnsWithActions.map(column => {
      const columnId = typeof column.id === 'string'
        ? column.id
        : ('accessorKey' in column && typeof column.accessorKey === 'string' ? column.accessorKey : '');

      return {
        ...column,
        enableResizing: true,
        size: columnSizes[columnId] || column.size || 150, // Используем сохраненный размер или дефолтный
      };
    });
  }, [columnsWithActions, columnSizes]);

  // Сохраняем порядок колонок в localStorage при его изменении
  const handleColumnOrderChange = (newOrder: string[]) => {
    setColumnOrder(newOrder);

    if (typeof window !== 'undefined' && persistSettings) {
      localStorage.setItem(`${tableId}-column-order`, JSON.stringify(newOrder));
    }
  };

  // Сохраняем видимость колонок в localStorage
  const handleColumnVisibilityChange = (newVisibility: VisibilityState) => {
    setColumnVisibility(newVisibility);

    if (typeof window !== 'undefined' && persistSettings) {
      localStorage.setItem(`${tableId}-column-visibility`, JSON.stringify(newVisibility));
    }
  };

  // Сохраняем размеры колонок в localStorage
  const handleColumnSizesChange = (newSizes: Record<string, number>) => {
    setColumnSizes(newSizes);

    if (typeof window !== 'undefined' && persistSettings) {
      localStorage.setItem(`${tableId}-column-sizes`, JSON.stringify(newSizes));
    }
  };

  // Инициализация таблицы
  const table = useReactTable({
    data,
    columns: columnsWithResize,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updaterOrValue) => {
      if (isDisabledSorting || !onSortingChange || !sorting) return;
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        onSortingChange(newSorting);
      } else {
        onSortingChange(updaterOrValue);
      }
    },
    onPaginationChange: (updaterOrValue) => {
      if (isDisabledPagination || !onPaginationChange || !pagination) return;
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        onPaginationChange(newPagination);
      } else {
        onPaginationChange(updaterOrValue);
      }
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        const newVisibility = updaterOrValue(columnVisibility);
        handleColumnVisibilityChange(newVisibility);
      } else {
        handleColumnVisibilityChange(updaterOrValue);
      }
    },
    onColumnOrderChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        const newOrder = updaterOrValue(columnOrder);
        handleColumnOrderChange(newOrder);
      } else {
        handleColumnOrderChange(updaterOrValue);
      }
    },
    onColumnSizingChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        const currentSizing = table.getState().columnSizing;
        const newSizing = updaterOrValue(currentSizing);
        handleColumnSizesChange(newSizing);
      } else {
        handleColumnSizesChange(updaterOrValue);
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      columnOrder,
      columnSizing: columnSizes,
    },
    // Серверная обработка
    manualPagination: true,
    manualSorting: true,
    enableSorting: sortableFields !== undefined,
    manualFiltering: true,
    pageCount,
    // Включаем функциональность изменения размера
    enableColumnResizing: isResizingEnabled,
    columnResizeMode: 'onChange',
  });

  // Если есть ошибка, показываем сообщение об ошибке
  if (error) {
    return <TableErrorState onRetry={onRetry} />;
  }

  // Обработчик поиска
  const handleSearch = (value: string) => {
    if (!onSearchChange) return;
    onSearchChange(value);
  };

  // Получаем настройки колонок для компонента настроек
  const columnSettings = table.getAllColumns()
    .filter(column => column.getCanHide())
    .map(column => ({
      id: column.id,
      title: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id,
      isVisible: column.getIsVisible(),
      canHide: column.getCanHide(),
      toggleVisibility: (value: boolean) => column.toggleVisibility(value),
    }));

  // Обработчик события завершения перетаскивания для @dnd-kit
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const currentOrder = [...table.getState().columnOrder];
    const activeIndex = currentOrder.indexOf(active.id as string);
    const overIndex = currentOrder.indexOf(over.id as string);

    if (activeIndex < 0 || overIndex < 0) {
      return;
    }

    // Создаем новый порядок колонок
    const newOrder = [...currentOrder];
    newOrder.splice(activeIndex, 1);
    newOrder.splice(overIndex, 0, active.id as string);

    // Обновляем порядок колонок в таблице
    table.setColumnOrder(newOrder);
  };

  // Сброс настроек таблицы
  const resetTableSettings = () => {
    // Сброс порядка колонок
    const defaultOrder = columns.map(col => {
      if (typeof col.id === 'string') return col.id;
      if ('accessorKey' in col) return String(col.accessorKey);
      return '';
    }).filter(id => id !== '');

    // Сброс видимости колонок (все видимы)
    const defaultVisibility = {};

    // Сброс размеров колонок
    const defaultSizes = {};

    // Применяем сброс
    table.setColumnOrder(defaultOrder);
    table.setColumnVisibility(defaultVisibility);
    setColumnSizes(defaultSizes);
    setIsReorderingEnabled(false);
    setIsResizingEnabled(false);

    // Удаляем из localStorage
    if (typeof window !== 'undefined' && persistSettings) {
      localStorage.removeItem(`${tableId}-column-order`);
      localStorage.removeItem(`${tableId}-column-visibility`);
      localStorage.removeItem(`${tableId}-column-sizes`);
    }
  };

  // Рендер основного содержимого таблицы
  const renderTableContent = () => (
    <Table className="w-full table-fixed">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
            {headerGroup.headers.map((header) => (
              <DraggableColumnHeader
                key={header.id}
                header={header as Header<TData, unknown>}
                isReorderingEnabled={isReorderingEnabled}
                isResizingEnabled={isResizingEnabled}
              />
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={`border-b border-gray-200 dark:border-gray-700 
                  transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/70
                  ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
              {/* Расширенная часть строки как отдельная строка таблицы */}
              {renderRowSubComponent && (
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableCell colSpan={table.getVisibleFlatColumns().length} className="p-0">
                    {renderRowSubComponent({ row })}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getVisibleFlatColumns().length}
              className="h-24"
            >
              <TableEmptyState />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Панель управления с поиском и настройками */}
      <div className={`flex items-center ${searchColumn ? "justify-between" : "justify-end"} mb-6 px-4 pt-4`}>
        {searchColumn && (
          <TableSearch
            placeholder={searchPlaceholder}
            onSearch={handleSearch}
            debounceMs={300}
          />
        )}
        <TableColumnSettings
          columns={columnSettings}
          isReorderingEnabled={isReorderingEnabled}
          isResizingEnabled={isResizingEnabled}
          onToggleReordering={setIsReorderingEnabled}
          onToggleResizing={setIsResizingEnabled}
          onResetSettings={resetTableSettings}
        />
      </div>

      {/* Индикаторы активных режимов */}
      {(isReorderingEnabled || isResizingEnabled) && (
        <div className="flex flex-wrap gap-2 mb-4 px-4">
          {isReorderingEnabled && (
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded-md flex items-center">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Режим переставления колонок активен
            </div>
          )}
          {isResizingEnabled && (
            <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded-md flex items-center">
              <Move className="h-3 w-3 mr-1" />
              Режим изменения размера колонок активен
            </div>
          )}
        </div>
      )}

      {/* Таблица с индикатором загрузки */}
      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg relative overflow-hidden">
        {isLoading && <TableLoadingOverlay />}

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            {isReorderingEnabled ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis]}
              >
                <SortableContext
                  items={table.getAllLeafColumns().map(column => column.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {renderTableContent()}
                </SortableContext>
              </DndContext>
            ) : (
              renderTableContent()
            )}
          </div>
        </div>
      </div>

      {/* Пагинация */}
      {!isDisabledPagination && onPaginationChange && pagination && (
        <TablePagination
          currentPage={pagination.pageIndex}
          pageCount={pageCount}
          pageSize={pagination.pageSize}
          totalCount={totalCount}
          onPageChange={(page) => onPaginationChange({ ...pagination, pageIndex: page })}
          onPageSizeChange={(size) => onPaginationChange({ ...pagination, pageSize: size })}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
        />
      )}
    </div>
  );
} 