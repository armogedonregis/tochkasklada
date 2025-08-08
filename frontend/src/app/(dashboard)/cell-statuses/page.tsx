'use client';

import React, { useState } from 'react';
import { 
  useGetCellStatusesQuery,
  useDeleteCellStatusMutation,
  useUpdateCellStatusMutation,
  useAddCellStatusMutation,
} from '@/services/cellStatusesService/cellStatusesApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { CellRentalStatus, CellStatus } from '@/services/cellStatusesService/cellStatuses.types';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { useFormModal } from '@/hooks/useFormModal';
import * as yup from 'yup';

// Схема валидации для клиента
const cellStatusValidationSchema = yup.object({
  name: yup.string().required('Название обязательно'),
  color: yup.string().required('Цвет обязателен'),
  statusType: yup.string().required('Тип статуса обязателен'),
});

const StatusMap = {
  [CellRentalStatus.ACTIVE]: 'Активная аренда',
  [CellRentalStatus.EXPIRING_SOON]: 'Осталось ≤ 2 дней',
  [CellRentalStatus.EXPIRED]: 'Просрочена',
  [CellRentalStatus.CLOSED]: 'Договор закрыт администратором',
  [CellRentalStatus.RESERVATION]: 'Бронь',
  [CellRentalStatus.EXTENDED]: 'Продлен',
  [CellRentalStatus.PAYMENT_SOON]: 'Осталось 3-7 дней'
}

export default function CellStatuses() {
  const { data: statuses, isLoading, isError, error } = useGetCellStatusesQuery();
    // Мутации для операций удаления
    const [deleteCellStatus] = useDeleteCellStatusMutation();
    const [updateCellStatus] = useUpdateCellStatusMutation();
    const [createCellStatus] = useAddCellStatusMutation();

  // Получаем список возможных типов статусов
  const { data: statusTypes } = useGetCellStatusesQuery();

  const modal = useFormModal<CellStatus, CellStatus>({
    onSubmit: async (values) => {
      
      if (modal.editItem) {
        await updateCellStatus({ 
          id: modal.editItem.id,
          name: values.name,
          color: values.color,
          statusType: values.statusType
        }).unwrap();
        toast.success('Статус успешно обновлен');
      } else {
        await createCellStatus({
          name: values.name,
          color: values.color,
          statusType: values.statusType
        }).unwrap();
        toast.success('Статус успешно создан');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении клиента');
    }
  });
  

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот статус?')) {
      try {
        await deleteCellStatus(id).unwrap();
        toast.success('Статус удален');
      } catch (error) {
        toast.error('Ошибка при удалении статуса');
        console.error('Ошибка при удалении статуса:', error);
      }
    }
  };

  const handleDeleteAdapter = (status: CellStatus) => {
    handleDelete(status.id);
  };

  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'Название',
      placeholder: 'Название статуса'
    },
    {
      type: 'input' as const,
      fieldName: 'color' as const,
      label: 'Цвет',
      inputType: 'color',
      placeholder: '#000000'
    },
    {
      type: 'select' as const,
      fieldName: 'statusType' as const,
      label: 'Тип статуса',
      options: Object.values(CellRentalStatus).map(statusType => ({
        label: StatusMap[statusType],
        value: statusType
      }))
    }
  ];

  // Определение колонок для таблицы
  const columns: ColumnDef<CellStatus>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => {
        const status = row.original;
        return <div className="py-2 px-1">{status.name}</div>;
      },
    },
    {
      accessorKey: 'color',
      header: 'Цвет',
      cell: ({ row }) => {
        const status = row.original;
        return (
          <div className="py-2 px-1 flex items-center">
            <div 
              className="w-6 h-6 rounded-full mr-2" 
              style={{ backgroundColor: status.color }}
            />
            <span>{status.color}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'statusType',
      header: 'Тип статуса',
      cell: ({ row }) => {
        const status = row.original;
        return <div className="py-2 px-1">{StatusMap[status.statusType as CellRentalStatus]}</div>;
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Статусы ячеек</h1>
        <Button onClick={() => modal.openCreate()} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Добавить статус
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Загрузка статусов...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">
            Ошибка при загрузке данных: {(error as any)?.data?.message || 'Неизвестная ошибка'}
          </p>
        </div>
      ) : statuses && statuses.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <BaseTable
            data={statuses}
            columns={columns}
            tableId="cell-statuses-table"
            isDisabledPagination
            isDisabledSorting
            onEdit={modal.openEdit}
            onDelete={handleDeleteAdapter}
            persistSettings={true}
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <p className="text-lg text-gray-600 dark:text-gray-300">Нет доступных статусов</p>
          <Button onClick={() => modal.openCreate()} className="mt-4">
            Добавить первый статус
          </Button>
        </div>
      )}

      {/* Модальное окно для создания/редактирования статуса */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать статус' : 'Добавить новый статус'}
        fields={modalFields}
        validationSchema={cellStatusValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          name: modal.editItem.name,
          color: modal.editItem.color || '',
          statusType: modal.editItem.statusType || CellRentalStatus.ACTIVE
        } : {
          name: '',
          color: '',
          statusType: CellRentalStatus.ACTIVE
        }}
      />
    </div>
  );
} 