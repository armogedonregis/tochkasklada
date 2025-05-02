'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
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
  Plus,
  Save,
  Trash2,
  ArrowUpDown,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'react-toastify';

// Определяем типы для ячеек, которые можно редактировать
interface EditableCellProps<TData> {
  getValue: () => any;
  row: Row<TData>;
  column: {
    id: string;
  };
  table: any;
  validateCell?: (value: any, columnId: string, rowData: any) => { isValid: boolean; errorMessage?: string };
  onNavigate?: (rowIndex: number, columnId: string, direction: 'up' | 'down' | 'left' | 'right') => void;
}

// Компонент для редактируемой ячейки
export function EditableCell<TData>({
  getValue,
  row,
  column,
  table,
  validateCell,
  onNavigate,
}: EditableCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Когда начальное значение изменяется, обновляем значение в состоянии
  useEffect(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  // Обработчик изменения значения в инпуте
  const onBlur = () => {
    if (validateCell && value !== initialValue) {
      const validation = validateCell(value, column.id, row.original);
      if (!validation.isValid) {
        setError(validation.errorMessage || 'Недопустимое значение');
        inputRef.current?.focus();
        return;
      }
    }
    
    setIsEditing(false);
    setError(null);
    
    if (value !== initialValue) {
      // Обновляем данные и явно устанавливаем флаг изменений
      table.options.meta?.updateData(row.index, column.id, value);
      // Убедимся, что флаг несохраненных изменений установлен
      if (table.options.meta?.setHasUnsavedChanges) {
        table.options.meta.setHasUnsavedChanges(true);
      }
    }
  };

  // Обработчик клавиш для навигации
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onBlur();
      if (onNavigate) {
        onNavigate(row.index, column.id, 'down');
      }
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
      setError(null);
    } else if (e.key === 'Tab') {
      onBlur();
      if (onNavigate && !e.shiftKey) {
        e.preventDefault();
        onNavigate(row.index, column.id, 'right');
      } else if (onNavigate && e.shiftKey) {
        e.preventDefault();
        onNavigate(row.index, column.id, 'left');
      }
    } else if (e.key === 'ArrowUp' && onNavigate) {
      if (e.ctrlKey || e.metaKey) {
        onBlur();
        e.preventDefault();
        onNavigate(row.index, column.id, 'up');
      }
    } else if (e.key === 'ArrowDown' && onNavigate) {
      if (e.ctrlKey || e.metaKey) {
        onBlur();
        e.preventDefault();
        onNavigate(row.index, column.id, 'down');
      }
    }
  };

  // Отрисовка ячейки в режиме редактирования или просмотра
  if (isEditing) {
    return (
      <div className="flex flex-col w-full h-full py-1 px-1">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className={`h-8 p-1 w-full ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {error && (
          <div className="mt-1 bg-red-100 text-red-700 text-xs p-1 border border-red-500 rounded break-words">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${error ? 'border-red-500' : ''}`}
      onClick={() => setIsEditing(true)}
      title={error || ''}
    >
      {value === null || value === undefined ? '-' : value}
    </div>
  );
}

// Основные типы для таблицы с возможностью редактирования
interface EditableTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
  searchColumn?: string;
  pageSize?: number;
  className?: string;
  onRowAdd?: () => void;
  onRowDelete?: (index: number) => void;
  onDataChange?: (updatedData: TData[]) => void;
  onSaveChanges?: (updatedData: TData[]) => void;
  addRowButtonText?: string;
  saveButtonText?: string;
  validateCell?: (value: any, columnId: string, rowData: any) => { isValid: boolean; errorMessage?: string };
  autoSaveTimeout?: number;
  exportFilename?: string;
  onImportData?: (importedData: Partial<TData>[]) => void;
}

// Функция для динамической загрузки XLSX и выполнения действий
type XLSXModule = typeof import('xlsx');

// Вспомогательная функция для получения значения ячейки
function getCellValue<TData>(row: TData, column: ColumnDef<TData, any>): any {
  if ('accessorFn' in column && typeof column.accessorFn === 'function') {
    try {
      return column.accessorFn(row, 0);
    } catch (error) {
      console.warn('Ошибка при получении значения через accessorFn:', error);
      return null;
    }
  }
  
  if ('accessorKey' in column) {
    return row[column.accessorKey as keyof TData];
  }
  
  if (column.id) {
    return (row as any)[column.id];
  }
  
  return null;
}

// Вспомогательная функция для получения заголовка колонки
function getColumnHeader(column: ColumnDef<any, any>): string {
  if (typeof column.header === 'string') {
    return column.header;
  }
  
  return column.id || '';
}

// Вспомогательная функция для получения ID колонки
function getColumnId(column: ColumnDef<any, any>): string {
  if ('accessorKey' in column) {
    return column.accessorKey as string;
  }
  
  return column.id || '';
}

// Функция для экспорта данных в Excel
function exportToExcel<TData>(data: TData[], columns: ColumnDef<TData, any>[], filename: string = 'export.xlsx') {
  // Необходимо динамически импортировать библиотеку xlsx только на клиенте
  import('xlsx').then((XLSX: XLSXModule) => {
    try {
      // Отфильтровываем колонки (убираем колонку действий)
      const exportColumns = columns.filter(column => column.id !== 'actions');
      
      // Получаем заголовки
      const headers = exportColumns.map(column => getColumnHeader(column));
      
      // Формируем строки данных
      const rows = data.map(row => {
        return exportColumns.map(column => {
          const value = getCellValue(row, column);
          return value === null || value === undefined ? '' : value;
        });
      });
      
      // Создаем книгу и лист
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные');
      
      // Сохраняем файл
      XLSX.writeFile(workbook, filename);
      
      toast.success('Данные успешно экспортированы в Excel');
    } catch (error) {
      console.error('Ошибка при экспорте в Excel:', error);
      toast.error('Не удалось экспортировать данные');
    }
  }).catch(error => {
    console.error('Ошибка загрузки библиотеки xlsx:', error);
    toast.error('Не удалось загрузить библиотеку xlsx');
  });
}

// Функция для импорта данных из Excel
async function importFromExcel<TData>(file: File, columns: ColumnDef<TData, any>[]): Promise<Partial<TData>[]> {
  try {
    // Импортируем XLSX библиотеку
    const XLSX = await import('xlsx');
    
    // Считываем файл
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Проверяем, есть ли листы
    if (!workbook.SheetNames.length) {
      throw new Error('Excel файл не содержит листов');
    }
    
    // Получаем первый лист
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Преобразуем лист в JSON
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
    
    if (!jsonData.length) {
      throw new Error('Файл не содержит данных');
    }
    
    // Создаем маппинг заголовков Excel к колонкам нашей модели
    const columnMap = new Map<string, string>();
    
    // Только колонки с данными (исключая actions)
    const dataColumns = columns.filter(column => column.id !== 'actions');
    
    // Заполняем маппинг
    dataColumns.forEach(column => {
      const header = getColumnHeader(column);
      const columnId = getColumnId(column);
      
      if (header && columnId) {
        columnMap.set(header, columnId);
      }
    });
    
    // Преобразуем данные
    const parsedData = jsonData.map(row => {
      const record: Record<string, any> = {};
      
      // Проходим по всем полям из Excel и находим соответствия
      Object.entries(row).forEach(([excelHeader, value]) => {
        const columnId = columnMap.get(excelHeader);
        if (columnId) {
          record[columnId] = value;
        }
      });
      
      return record as Partial<TData>;
    });
    
    return parsedData;
  } catch (error) {
    console.error('Ошибка при импорте из Excel:', error);
    throw error instanceof Error ? error : new Error('Неизвестная ошибка при импорте');
  }
}

export function EditableTable<TData>({
  data,
  columns,
  searchPlaceholder = 'Поиск...',
  searchColumn,
  pageSize = 10,
  className = '',
  onRowAdd,
  onRowDelete,
  onDataChange,
  onSaveChanges,
  addRowButtonText = 'Добавить строку',
  saveButtonText = 'Сохранить изменения',
  validateCell,
  autoSaveTimeout = 0,
  exportFilename,
  onImportData,
}: EditableTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableData, setTableData] = useState(() => [...data]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Обновление внутренних данных когда внешние данные изменяются
  useEffect(() => {
    setTableData(data);
    setHasUnsavedChanges(false);
  }, [data]);

  // Настройка автосохранения
  useEffect(() => {
    return () => {
      // Очистка таймера при размонтировании
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Функция для обновления данных в таблице
  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setTableData((old) => {
      const newData = [...old];
      if (newData[rowIndex]) {
        newData[rowIndex] = {
          ...newData[rowIndex],
          [columnId]: value,
        };
      }
      return newData;
    });
    
    // Устанавливаем флаг несохраненных изменений
    setHasUnsavedChanges(true);
    
    // Вызываем колбэк изменения данных с небольшой задержкой,
    // чтобы быть уверенными, что tableData уже обновлен
    setTimeout(() => {
      if (onDataChange) {
        onDataChange(tableData.map((row, idx) => {
          if (idx === rowIndex) {
            return { ...row, [columnId]: value };
          }
          return row;
        }));
      }
    }, 0);

    // Если включено автосохранение, настраиваем таймер
    if (autoSaveTimeout > 0 && onSaveChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        handleSaveChanges();
      }, autoSaveTimeout);
    }
  };

  // Навигация между ячейками
  const handleCellNavigation = (rowIndex: number, columnId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    // Находим индекс текущей колонки
    const columnIndex = columns.findIndex(col => {
      if (col.id === columnId) return true;
      if ('accessorKey' in col && col.accessorKey === columnId) return true;
      return false;
    });
    
    if (columnIndex === -1) return;
    
    let nextColumnIndex = columnIndex;
    let nextRowIndex = rowIndex;
    
    if (direction === 'right') {
      nextColumnIndex = (columnIndex + 1) % columns.length;
      // Пропускаем колонку действий
      if (columns[nextColumnIndex].id === 'actions') {
        nextColumnIndex = (nextColumnIndex + 1) % columns.length;
      }
    } else if (direction === 'left') {
      nextColumnIndex = (columnIndex - 1 + columns.length) % columns.length;
      // Пропускаем колонку действий
      if (columns[nextColumnIndex].id === 'actions') {
        nextColumnIndex = (nextColumnIndex - 1 + columns.length) % columns.length;
      }
    } else if (direction === 'up') {
      nextRowIndex = Math.max(0, rowIndex - 1);
    } else if (direction === 'down') {
      nextRowIndex = Math.min(tableData.length - 1, rowIndex + 1);
    }
    
    // Получаем ID следующей колонки
    const nextColumn = columns[nextColumnIndex];
    const nextColumnId = nextColumn.id || ('accessorKey' in nextColumn ? nextColumn.accessorKey as string : '');
    
    // Находим и фокусируемся на ячейке
    const cellId = `${nextRowIndex}-${nextColumnId}`;
    const cell = document.getElementById(cellId);
    
    if (cell) {
      cell.click();
    }
  };

  // Добавление новой строки
  const handleAddRow = () => {
    if (onRowAdd) {
      onRowAdd();
    }
  };

  // Удаление строки
  const handleDeleteRow = (index: number) => {
    if (onRowDelete) {
      onRowDelete(index);
    } else {
      setTableData((old) => {
        const newData = [...old];
        newData.splice(index, 1);
        return newData;
      });
      setHasUnsavedChanges(true);
      if (onDataChange) {
        onDataChange([...tableData]);
      }
    }
  };

  // Сохранение изменений
  const handleSaveChanges = () => {
    if (onSaveChanges && hasUnsavedChanges) {
      onSaveChanges(tableData);
      setHasUnsavedChanges(false);
      toast.success('Изменения сохранены');
    } else if (!hasUnsavedChanges) {
      toast.info('Нет несохраненных изменений');
    }
  };

  // Обработчик клика по кнопке импорта
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Обработчик выбора файла Excel
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportData) return;

    try {
      const parsedData = await importFromExcel<TData>(file, columns);
      
      // Вызываем колбэк импорта
      onImportData(parsedData);
      
      // Очищаем input, чтобы можно было выбрать тот же файл снова
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success(`Импортировано ${parsedData.length} записей`);
    } catch (error) {
      console.error('Ошибка импорта Excel:', error);
      toast.error(`Ошибка импорта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  // Настройка таблицы
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    meta: {
      updateData,
      setHasUnsavedChanges,
    },
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Функция для безопасного клонирования React-элементов
  const safeCloneElement = (element: React.ReactNode, props: any) => {
    if (React.isValidElement(element)) {
      try {
        return React.cloneElement(element, props);
      } catch (error) {
        console.warn('Не удалось клонировать элемент с расширенными свойствами', error);
        return element;
      }
    }
    return element;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {/* Поиск */}
        {searchColumn && (
          <div className="flex-1">
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchColumn)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex space-x-2">
          {onRowAdd && (
            <Button onClick={handleAddRow} variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              {addRowButtonText}
            </Button>
          )}
          {onSaveChanges && (
            <Button 
              onClick={handleSaveChanges} 
              disabled={!hasUnsavedChanges}
              className={!hasUnsavedChanges ? 'opacity-50' : ''}
            >
              <Save className="h-4 w-4 mr-1" />
              {saveButtonText}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => exportToExcel(tableData, columns, exportFilename || 'export.xlsx')}
            title="Экспорт в Excel"
          >
            <Download className="h-4 w-4 mr-1" />
            Экспорт
          </Button>
          {onImportData && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
              />
              <Button
                variant="outline"
                onClick={handleImportClick}
                title="Импорт из Excel"
              >
                <Upload className="h-4 w-4 mr-1" />
                Импорт
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Индикатор несохраненных изменений */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm text-yellow-700 flex items-center">
          <span className="mr-2">⚠️</span>
          <span>Есть несохраненные изменения</span>
        </div>
      )}

      {/* Таблица */}
      <div className={`rounded-md border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center space-x-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="ml-1 h-4 w-4"/>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const content = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      );

                      return (
                        <TableCell 
                          key={cell.id} 
                          className="text-gray-700 dark:text-gray-300 align-top p-0"
                          style={{ minHeight: '40px', height: 'auto' }}
                          id={`${row.index}-${cell.column.id}`}
                        >
                          {safeCloneElement(content, {
                            validateCell,
                            onNavigate: handleCellNavigation
                          })}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
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

      <div className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <span>
          Клавиатурная навигация: <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Tab</kbd> следующая ячейка, 
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Shift+Tab</kbd> предыдущая, 
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> вниз, 
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> отмена
        </span>
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-gray-500 dark:text-gray-400">
          {table.getFilteredSelectedRowModel().rows.length} из{' '}
          {table.getFilteredRowModel().rows.length} строк
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
            Страница{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} из{' '}
              {table.getPageCount() || 1}
            </strong>
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