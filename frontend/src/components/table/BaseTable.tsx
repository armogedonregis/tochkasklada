'use client';

import React, { useState, CSSProperties } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  ColumnOrderState,
  Updater,
  VisibilityState,
  Header,
  Cell,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
  Settings,
  Move,
  ArrowUpDown,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { TableActions } from '@/components/table/TableActions';

// dnd-kit импорты
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Компонент для отображения перетаскиваемого заголовка колонки
function DraggableColumnHeader<TData>({
  header,
  isReorderingEnabled,
}: {
  header: Header<TData, unknown>;
  isReorderingEnabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: header.id,
    disabled: !isReorderingEnabled,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // transform вместо полного CSS
    transition: isReorderingEnabled ? 'width transform 0.2s ease-in-out' : undefined,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <TableHead 
      ref={isReorderingEnabled ? setNodeRef : undefined}
      key={header.id}
      style={style}
      className={`
        bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium
        ${isReorderingEnabled ? 'cursor-move' : ''}
        relative ${header.column.getCanSort() && !isReorderingEnabled ? 'cursor-pointer select-none' : ''}
        ${header.column.getCanResize() ? 'resize-x' : ''}
      `}
      onClick={header.column.getCanSort() && !isReorderingEnabled 
        ? header.column.getToggleSortingHandler()
        : undefined}
      {...(isReorderingEnabled ? { ...attributes, ...listeners } : {})}
    >
      <div className="flex items-center py-3">
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
        <span className="ml-1">
          {{
            asc: ' ↑',
            desc: ' ↓',
          }[header.column.getIsSorted() as string] ?? null}
        </span>
      </div>
      {/* Возможность изменения размера колонки */}
      {header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none ${
            header.column.getIsResizing() ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        />
      )}
    </TableHead>
  );
}

interface BaseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
  searchColumn?: string;
  pageSize?: number;
  className?: string;
  onRowClick?: (row: TData) => void;
  renderRowSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  enableColumnReordering?: boolean;
  defaultColumnOrder?: string[];
  persistColumnOrder?: boolean;
  tableId?: string;
  // Действия для строк таблицы
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  enableActions?: boolean;
}

export function BaseTable<TData>({
  data,
  columns,
  searchPlaceholder = 'Поиск...',
  searchColumn,
  pageSize = 10,
  className = '',
  onRowClick,
  renderRowSubComponent,
  enableColumnReordering = false,
  defaultColumnOrder,
  persistColumnOrder = false,
  tableId = 'table',
  // Действия для строк таблицы
  onEdit,
  onDelete,
  enableActions = false,
}: BaseTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isReorderingEnabled, setIsReorderingEnabled] = useState(false);
  const [isResizingEnabled, setIsResizingEnabled] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  
  // Добавляем колонку с действиями, если включены действия
  const columnsWithActions = React.useMemo(() => {
    if (enableActions && onEdit && onDelete) {
      // Проверяем, есть ли уже колонка с actions
      const hasActionsColumn = columns.some(column => {
        if (typeof column.id === 'string' && column.id === 'actions') {
          return true;
        }
        
        if ('accessorKey' in column && typeof column.accessorKey === 'string' && column.accessorKey === 'actions') {
          return true;
        }
        
        return false;
      });
      
      if (!hasActionsColumn) {
        return [
          ...columns,
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
    return columns;
  }, [columns, enableActions, onEdit, onDelete]);
  
  // Получаем сохраненный ранее порядок колонок из localStorage, если доступно
  const getSavedColumnOrder = (): string[] | undefined => {
    if (typeof window !== 'undefined' && persistColumnOrder) {
      const savedOrder = localStorage.getItem(`${tableId}-column-order`);
      return savedOrder ? JSON.parse(savedOrder) : undefined;
    }
    return undefined;
  };

  // Получаем сохраненную видимость колонок
  const getSavedColumnVisibility = (): VisibilityState | undefined => {
    if (typeof window !== 'undefined' && persistColumnOrder) {
      const savedVisibility = localStorage.getItem(`${tableId}-column-visibility`);
      return savedVisibility ? JSON.parse(savedVisibility) : undefined;
    }
    return undefined;
  };
  
  // Инициализация порядка колонок
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    getSavedColumnOrder() || defaultColumnOrder || columns.map(col => {
      if (typeof col.id === 'string') return col.id;
      // Используем accessorKey как строку, если доступно
      if ('accessorKey' in col) {
        return String(col.accessorKey);
      }
      return '';
    }).filter(id => id !== '')
  );

  // Инициализация видимости колонок
  useState(() => {
    const savedVisibility = getSavedColumnVisibility();
    if (savedVisibility) {
      setColumnVisibility(savedVisibility);
    }
  });

  // Настройка сенсоров для dnd-kit
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, {})
  );

  // Сохраняем порядок колонок в localStorage при его изменении
  const handleColumnOrderChange = (updaterOrValue: Updater<ColumnOrderState>) => {
    let newOrder: ColumnOrderState;
    
    if (typeof updaterOrValue === 'function') {
      // Если updaterOrValue - функция, вызываем ее с текущим состоянием columnOrder
      newOrder = updaterOrValue(columnOrder);
    } else {
      // Иначе используем значение напрямую
      newOrder = updaterOrValue;
    }
    
    setColumnOrder(newOrder);
    
    if (typeof window !== 'undefined' && persistColumnOrder) {
      localStorage.setItem(`${tableId}-column-order`, JSON.stringify(newOrder));
    }
  };

  // Сохраняем видимость колонок в localStorage
  const handleColumnVisibilityChange = (updaterOrValue: Updater<VisibilityState>) => {
    let newVisibility: VisibilityState;
    
    if (typeof updaterOrValue === 'function') {
      newVisibility = updaterOrValue(columnVisibility);
    } else {
      newVisibility = updaterOrValue;
    }
    
    setColumnVisibility(newVisibility);
    
    if (typeof window !== 'undefined' && persistColumnOrder) {
      localStorage.setItem(`${tableId}-column-visibility`, JSON.stringify(newVisibility));
    }
  };

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    enableColumnResizing: isResizingEnabled,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      columnFilters,
      columnOrder,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Обработчик события завершения перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over && active.id !== over.id) {
      setColumnOrder(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        
        const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
        
        // Сохраняем в localStorage, если нужно
        if (typeof window !== 'undefined' && persistColumnOrder) {
          localStorage.setItem(`${tableId}-column-order`, JSON.stringify(newOrder));
        }
        
        return newOrder;
      });
    }
  };

  // Сбросить порядок колонок
  const resetColumnOrder = () => {
    const defaultOrder = columns.map(col => {
      if (typeof col.id === 'string') return col.id;
      if ('accessorKey' in col) return String(col.accessorKey);
      return '';
    }).filter(id => id !== '');
    
    setColumnOrder(defaultOrder);
    
    if (typeof window !== 'undefined' && persistColumnOrder) {
      localStorage.setItem(`${tableId}-column-order`, JSON.stringify(defaultOrder));
    }
  };

  // Отрисовка таблицы
  const renderTable = () => (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                {isReorderingEnabled ? (
                  <SortableContext
                    items={headerGroup.headers.map(header => header.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableColumnHeader 
                        key={header.id} 
                        header={header as Header<TData, unknown>}
                        isReorderingEnabled={isReorderingEnabled}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  headerGroup.headers.map((header) => (
                    <DraggableColumnHeader 
                      key={header.id} 
                      header={header as Header<TData, unknown>}
                      isReorderingEnabled={false}
                    />
                  ))
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={`
                      border-b border-gray-200 dark:border-gray-700 
                      transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/70
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="py-3 text-gray-700 dark:text-gray-300"
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* Расширенная часть строки */}
                  {renderRowSubComponent && (
                    <tr>
                      <td colSpan={columns.length}>
                        {renderRowSubComponent({ row })}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleFlatColumns().length}
                  className="h-24 text-center text-gray-500 dark:text-gray-400"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Панель управления */}
      <div className="flex items-center justify-between mb-6 px-4 pt-4">
        {/* Поиск */}
        <div className="flex-1 max-w-md">
          {searchColumn && (
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                }
                className="w-full"
              />
              {(table.getColumn(searchColumn)?.getFilterValue() as string) && (
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => table.getColumn(searchColumn)?.setFilterValue('')}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Меню настроек таблицы */}
        <div className="flex items-center gap-2 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1 items-center">
                <Settings className="h-4 w-4" />
                <span>Настройки</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Управление таблицей</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={isReorderingEnabled}
                  onCheckedChange={(checked) => setIsReorderingEnabled(!!checked)}
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Переставление колонок</span>
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem
                  checked={isResizingEnabled}
                  onCheckedChange={(checked) => setIsResizingEnabled(!!checked)}
                >
                  <Move className="mr-2 h-4 w-4" />
                  <span>Изменение размера колонок</span>
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Видимость колонок</DropdownMenuLabel>
              {table.getAllColumns()
                .filter(
                  (column) => 
                    column.getCanHide() && 
                    typeof column.id === 'string' && 
                    column.id !== 'actions'
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                    >
                      {column.getIsVisible() ? (
                        <Eye className="mr-2 h-4 w-4" />
                      ) : (
                        <EyeOff className="mr-2 h-4 w-4" />
                      )}
                      {typeof column.columnDef.header === 'string' 
                        ? column.columnDef.header 
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={resetColumnOrder}>
                <span className="mr-2">↺</span>
                <span>Сбросить настройки</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      {/* Таблица с DndContext, если включено переставление колонок */}
      <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700">
        {isReorderingEnabled ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
          >
            {renderTable()}
          </DndContext>
        ) : (
          renderTable()
        )}
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{table.getFilteredRowModel().rows.length} строк</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="border rounded px-1 py-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {[10, 20, 30, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Показать {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">На первую страницу</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">На предыдущую страницу</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Страница {table.getState().pagination.pageIndex + 1} из{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">На следующую страницу</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">На последнюю страницу</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 