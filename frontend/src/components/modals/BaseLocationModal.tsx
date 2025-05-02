'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BaseForm from '../forms/BaseForm';
import { IForm } from '@/types/form';
import { FieldValues, DefaultValues } from 'react-hook-form';
import { ObjectSchema } from 'yup';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[570px]">
        <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
            {description && (
              <>
                <div className="h-[2px] my-3 bg-gray-100 dark:bg-gray-700 w-full" />
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
                  className="h-12 px-6 py-3 text-base font-semibold text-gray-700 bg-transparent border border-gray-300 rounded-2xl hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  variant="outline"
                >
                  {cancelText}
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="h-12 px-6 py-3 text-base font-semibold text-white bg-red-600 rounded-2xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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