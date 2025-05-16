import React from 'react';
import { Button } from '@/components/ui/button';

interface TableErrorStateProps {
  onRetry?: () => void;
}

export function TableErrorState({ onRetry }: TableErrorStateProps) {
  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Ошибка при загрузке данных
        </h3>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Повторить попытку
          </Button>
        )}
      </div>
    </div>
  );
}

export function TableLoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Загрузка данных...</span>
      </div>
    </div>
  );
}

export function TableEmptyState() {
  return (
    <div className="flex justify-center items-center h-24 text-center text-gray-500 dark:text-gray-400">
      Нет данных
    </div>
  );
} 