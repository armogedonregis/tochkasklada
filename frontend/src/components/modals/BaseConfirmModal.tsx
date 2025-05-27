'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  confirmIcon?: React.ReactNode;
  loadingText?: string;
}

export const BaseConfirmModal: React.FC<BaseConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  isLoading = false,
  className = 'sm:max-w-[420px]',
  icon,
  confirmButtonClassName = "bg-gradient-to-r from-[#F62D40] to-[#F8888F] hover:from-[#E11830] hover:to-[#E76A73]",
  cancelButtonClassName = "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300",
  confirmIcon,
  loadingText = 'Обработка...'
}) => {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isLoading) {

        }
      }}
    >
      <DialogContent 
        className={cn("p-0", className)}
        onInteractOutside={(e) => isLoading ? e.preventDefault() : null}
        onEscapeKeyDown={(e) => isLoading ? e.preventDefault() : null}
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
          <div className={cn("mb-4", icon ? "flex flex-col items-center text-center" : "")}>
            {icon && (
              <div className="mb-4">
                {icon}
              </div>
            )}
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
            </DialogHeader>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {description}
              </p>
            )}
          </div>

          <div className={cn("flex gap-3", icon ? "justify-center" : "justify-end")}>
            <Button
              type="button"
              onClick={onClose}
              className={cn(
                "h-11 px-5 py-2.5 text-sm font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                cancelButtonClassName
              )}
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
                confirmButtonClassName,
                "disabled:opacity-50 disabled:pointer-events-none transition-all"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingText}
                </>
              ) : (
                <>
                  {confirmIcon && (
                    <span className="mr-2">{confirmIcon}</span>
                  )}
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