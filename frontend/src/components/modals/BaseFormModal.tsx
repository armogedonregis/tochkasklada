'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BaseForm from '../forms/BaseForm';
import { IForm } from '@/components/forms/types';
import { FieldValues, DefaultValues } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { Loader2 } from 'lucide-react';

interface BaseFormModalProps<T extends FieldValues> {
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
  formData?: Partial<T>;
  className?: string;
  isLoading?: boolean;
  isCheckBoxWithSelectMulty?: boolean;
}

export const BaseFormModal = <T extends FieldValues>({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  validationSchema,
  submitText = 'Сохранить',
  cancelText = 'Отмена',
  defaultValues,
  formData,
  className = 'sm:max-w-[570px]',
  isLoading = false,
  isCheckBoxWithSelectMulty = false
}: BaseFormModalProps<T>) => {
  const formDefaultValues = formData ? formData as DefaultValues<T> : defaultValues;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent 
        className={`p-0 ${className}`}
        onInteractOutside={(e) => isLoading ? e.preventDefault() : null}
        onEscapeKeyDown={(e) => isLoading ? e.preventDefault() : null}
      >
        <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg">
          <DialogHeader className="mb-4 relative">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
            
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
            inputClassName="grid grid-cols-1 gap-2"
            defaultValues={formDefaultValues}
            isCheckBoxWithSelectMulty={isCheckBoxWithSelectMulty}
            renderButtons={(form) => (
              <div className="flex justify-end space-x-3 pt-4">
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
                  type="submit"
                  disabled={!form.formState.isValid || isLoading}
                  className="h-11 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#F62D40] to-[#F8888F] rounded-md hover:from-[#E11830] hover:to-[#E76A73] disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    submitText
                  )}
                </Button>
              </div>
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 