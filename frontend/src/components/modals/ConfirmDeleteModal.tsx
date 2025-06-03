'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  entityName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  danger?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Подтверждение удаления',
  description,
  entityName,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  isLoading = false,
  className = 'sm:max-w-[420px]',
  icon = <AlertTriangle className="h-12 w-12 text-amber-500" />,
  danger = true,
}) => {
  // Формируем описание, если не передано
  const finalDescription = description ||
    `Вы уверены, что хотите удалить ${entityName || 'этот элемент'}? Это действие нельзя отменить.`;

  return (
    <Dialog
      open={isOpen}
    >
      <DialogContent
        className={cn("p-0", className)}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="mb-4">
              {icon}
            </div>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {finalDescription}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="h-11 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              variant="outline"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "h-11 px-5 py-2.5 text-sm font-semibold text-white rounded-md",
                danger
                  ? "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                  : "bg-gradient-to-r from-[#F62D40] to-[#F8888F] hover:from-[#E11830] hover:to-[#E76A73]",
                "disabled:opacity-50 disabled:pointer-events-none transition-all"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  {confirmText}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 