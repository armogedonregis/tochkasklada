import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

export function TablePagination({
  currentPage,
  pageCount,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  canPreviousPage,
  canNextPage,
}: TablePaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{totalCount} строк</span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className="border rounded px-2 py-2 sm:px-1 sm:py-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 min-h-[44px] sm:min-h-[32px] touch-manipulation"
        >
          {[10, 20, 30, 50, 100].map(size => (
            <option key={size} value={size}>
              Показать {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-11 w-11 sm:h-8 sm:w-8 p-0 border-gray-200 dark:border-gray-700 touch-manipulation"
          onClick={() => onPageChange(0)}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">На первую страницу</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-11 w-11 sm:h-8 sm:w-8 p-0 border-gray-200 dark:border-gray-700 touch-manipulation"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">На предыдущую страницу</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
          <span className="hidden sm:inline">Страница {currentPage + 1} из {Math.max(1, pageCount)}</span>
          <span className="sm:hidden">{currentPage + 1} / {Math.max(1, pageCount)}</span>
        </span>
        <Button
          variant="outline"
          className="h-11 w-11 sm:h-8 sm:w-8 p-0 border-gray-200 dark:border-gray-700 touch-manipulation"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNextPage}
        >
          <span className="sr-only">На следующую страницу</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-11 w-11 sm:h-8 sm:w-8 p-0 border-gray-200 dark:border-gray-700 touch-manipulation"
          onClick={() => onPageChange(Math.max(0, pageCount - 1))}
          disabled={!canNextPage}
        >
          <span className="sr-only">На последнюю страницу</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 