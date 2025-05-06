'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BaseForm from '../forms/BaseForm';
import { IForm } from '@/types/form';
import { FieldValues, DefaultValues } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { X } from 'lucide-react';

interface BaseLocationModalProps<T extends FieldValues> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  title: string;
  description?: string;
  fields: IForm<T>[];
  validationSchema: ObjectSchema<any>;
  submitText?: string;
  cancelText?: string;
  defaultValues?: DefaultValues<T>;
}

export const BaseLocationModal = <T extends FieldValues>({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  validationSchema,
  submitText = 'Добавить',
  cancelText = 'Отмена',
  defaultValues
}: BaseLocationModalProps<T>) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Здесь мы ничего не делаем, чтобы предотвратить закрытие
      }
    }}>
      <DialogContent className="sm:max-w-[570px] p-0" onEscapeKeyDown={(e) => e.preventDefault()}>
        <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg">
          <DialogHeader className="mb-4 relative">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
            <button 
              onClick={onClose} 
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              type="button"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
            {description && (
              <>
                <div className="h-[2px] my-3 bg-gray-200 dark:bg-gray-700 w-full" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              </>
            )}
          </DialogHeader>

          <BaseForm
            fields={fields}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            containerClassName="space-y-4"
            formClassName="space-y-6"
            inputClassName="space-y-4"
            defaultValues={defaultValues}
            renderButtons={(form) => (
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  variant="outline"
                >
                  {cancelText}
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="h-11 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#F62D40] to-[#F8888F] rounded-md hover:from-[#E11830] hover:to-[#E76A73] disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  {submitText}
                </Button>
              </div>
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};