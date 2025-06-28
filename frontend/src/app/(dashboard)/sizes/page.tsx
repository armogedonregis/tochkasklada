'use client';

import { useState } from 'react';
import { 
  useGetSizesQuery, 
  useDeleteSizeMutation,
  useAddSizeMutation,
  useUpdateSizeMutation
} from '@/services/sizesService/sizesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { Size } from '@/services/sizesService/sizes.types';
import * as yup from 'yup';
import { useFormModal } from '@/hooks/useFormModal';

// Схема валидации для размеров
const sizeValidationSchema = yup.object({
  name: yup.string().required('Название обязательно'),
  short_name: yup.string().required('Короткое название обязательно'),
  size: yup.string().required('Размер обязателен'),
  area: yup.string().required('Площадь обязательна')
});

// Тип для полей формы
interface SizeFormFields {
  name: string;
  short_name: string;
  size: string;
  area: string;
}

export default function SizesPage() {
  
  // Получение данных о размерах с учетом параметров
  const { data, error, isLoading, refetch } = useGetSizesQuery();
  
  // Данные размеров теперь находятся в свойстве data пагинированного ответа
  const sizes = data || [];
  
  // Мутации для операций с размерами
  const [deleteSize] = useDeleteSizeMutation();
  const [addSize] = useAddSizeMutation();
  const [updateSize] = useUpdateSizeMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<SizeFormFields, Size>({
    onSubmit: async (values) => {
      if (modal.editItem) {
        await updateSize({ 
          id: modal.editItem.id,
          ...values
        }).unwrap();
        toast.success('Размер успешно обновлен');
      } else {
        await addSize(values).unwrap();
        toast.success('Размер успешно добавлен');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении размера');
    }
  });

  // Обработчик удаления
  const handleDelete = async (size: Size) => {
    if (window.confirm('Вы уверены, что хотите удалить этот размер?')) {
      try {
        await deleteSize(size.id).unwrap();
        toast.success('Размер успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении размера');
      }
    }
  };

  // Определение колонок таблицы
  const columns: ColumnDef<Size>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      accessorKey: 'short_name',
      header: 'Короткое название',
    },
    {
      accessorKey: 'size',
      header: 'Размер',
    },
    {
      accessorKey: 'area',
      header: 'Площадь',
    }
  ];

  // Поля формы для модального окна
  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'Название',
      placeholder: 'Например: Большая'
    },
    {
      type: 'input' as const,
      fieldName: 'short_name' as const,
      label: 'Короткое название',
      placeholder: 'Например: L'
    },
    {
      type: 'input' as const,
      fieldName: 'size' as const,
      label: 'Размер',
      placeholder: 'Например: 2x3 м'
    },
    {
      type: 'input' as const,
      fieldName: 'area' as const,
      label: 'Площадь',
      placeholder: 'Например: 6 м²'
    }
  ];

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={() => modal.openCreate()}>
          Добавить размер (TEST AUTODEPLOY)
        </Button>
      </div>

      {/* Таблица */}
      <div className="rounded-md border">
        <BaseTable
          data={sizes}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Поиск по названию размера..."
          onEdit={modal.openEdit}
          onDelete={handleDelete}
          tableId="sizes-table"
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          persistSettings={true}
          isDisabledPagination={true}
          isDisabledSorting={true}
        />
      </div>

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать размер' : 'Добавить размер'}
        fields={modalFields}
        validationSchema={sizeValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          name: modal.editItem.name,
          short_name: modal.editItem.short_name,
          size: modal.editItem.size,
          area: modal.editItem.area
        } : {
          name: '',
          short_name: '',
          size: '',
          area: ''
        }}
      />
    </>
  );
} 