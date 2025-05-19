'use client';

import { useState } from 'react';
import { useGetAdminCellsQuery, useDeleteCellMutation, useAddCellMutation, useUpdateCellMutation } from '@/services/cellService/cellsApi';
import { useGetContainersQuery } from '@/services/containersService/containersApi';
import { useGetSizesQuery } from '@/services/sizesService/sizesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { Cell, CreateCellDto, CellFilters, CellSortField as ImportedCellSortField } from '@/services/cellService/cell.types';
import { Container } from '@/services/containersService/container.types';
import { Size } from '@/services/sizesService/sizes.types';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';
import { SortDirection } from '@/services/services.types';

// Схема валидации для ячеек
const cellValidationSchema = yup.object({
  name: yup.string().required('Название ячейки обязательно'),
  containerId: yup.string().required('Выберите контейнер'),
  size_id: yup.string().required('Выберите размер'),
  comment: yup.string().required('Укажите размеры')
});

// Тип для полей формы
interface CellFormFields {
  name: string;
  containerId: string;
  size_id: string;
  comment: string;
}

export default function CellsPage() {
  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<ImportedCellSortField>({
    defaultPageSize: 10,
    searchDebounceMs: 300
  });
  
  // Преобразуем параметры запроса из useTableControls в формат для cellsApi
  const cellFilters: CellFilters = {
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    search: tableControls.queryParams.search,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection as SortDirection
  };
  
  // Получение данных о ячейках с учетом параметров
  const { data, error, isLoading, refetch } = useGetAdminCellsQuery(cellFilters);
  
  // Данные ячеек теперь находятся в свойстве data пагинированного ответа
  const cells = data?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;
  
  // Получение данных о размерах
  const { data: sizes = [] } = useGetSizesQuery();
  
  // Получение данных о контейнерах
  const { data: containers = [] } = useGetContainersQuery();
  const containersList = Array.isArray(containers) ? containers : containers.data || [];
  
  // Мутации для операций с ячейками
  const [deleteCell] = useDeleteCellMutation();
  const [addCell] = useAddCellMutation();
  const [updateCell] = useUpdateCellMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<CellFormFields, Cell>({
    onSubmit: async (values) => {
      if (modal.editItem) {
        await updateCell({ 
          id: modal.editItem.id,
          name: values.name,
          containerId: values.containerId,
          size_id: values.size_id,
          comment: values.comment
        }).unwrap();
        toast.success('Ячейка успешно обновлена');
      } else {
        await addCell({
          name: values.name,
          containerId: values.containerId,
          size_id: values.size_id,
          comment: values.comment
        }).unwrap();
        toast.success('Ячейка успешно добавлена');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении ячейки');
    }
  });

  // Обработчик удаления
  const handleDelete = async (cell: Cell) => {
    if (window.confirm('Вы уверены, что хотите удалить эту ячейку?')) {
      try {
        await deleteCell(cell.id).unwrap();
        toast.success('Ячейка успешно удалена');
      } catch (error) {
        toast.error('Ошибка при удалении ячейки');
      }
    }
  };

  // Форматируем контейнеры для селектора
  const containerOptions = containersList.map((container: Container) => {
    const containerName = typeof container.name === 'number' 
      ? (container.name < 10 ? `0${container.name}` : `${container.name}`)
      : container.name;
    
    return {
      label: `${containerName} (${container.location?.short_name || 'Нет локации'})`,
      value: container.id
    };
  });

  // Определение колонок таблицы
  const columns: ColumnDef<Cell>[] = [
    {
      accessorKey: 'name',
      header: 'Ячейка',
    },
    {
      accessorKey: 'comment',
      header: 'Размеры',
      cell: ({ row }) => {
        return row.original.comment || '-';
      }
    },
    {
      id: 'size',
      header: 'Тип размера',
      cell: ({ row }) => {
        const sizeId = row.original.size_id;
        const size = sizes.find((s: Size) => s.id === sizeId);
        return size?.name || 'Не указан';
      },
    },
    {
      id: 'container',
      header: 'Контейнер',
      cell: ({ row }) => {
        // Находим контейнер по ID
        const container = containersList.find(
          (c: Container) => c.id === row.original.containerId
        );
        if (!container) return 'Не найден';
        
        // Форматируем номер с лидирующим нулем если нужно
        const containerName = typeof container.name === 'number'
          ? (container.name < 10 ? `0${container.name}` : `${container.name}`)
          : container.name;
          
        return containerName;
      },
    },
    {
      id: 'location',
      header: 'Локация',
      cell: ({ row }) => {
        // Находим контейнер по ID
        const container = containersList.find(
          (c: Container) => c.id === row.original.containerId
        );
        return container?.location?.short_name || 'Не указана';
      },
    },
    {
      id: 'city',
      header: 'Город',
      cell: ({ row }) => {
        // Находим контейнер по ID
        const container = containersList.find(
          (c: Container) => c.id === row.original.containerId
        );
        return container?.location?.city?.short_name || 'Не указан';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания',
      cell: ({ row }) => row.original.createdAt 
        ? new Date(row.original.createdAt).toLocaleDateString('ru-RU') 
        : '-',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Дата обновления',
      cell: ({ row }) => row.original.updatedAt 
        ? new Date(row.original.updatedAt).toLocaleDateString('ru-RU') 
        : '-',
    },
  ];

  // Поля формы для модального окна
  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'Название ячейки',
      placeholder: 'Например: A1'
    },
    // Используем обычный селект для контейнеров
    {
      type: 'select' as const,
      fieldName: 'containerId' as const,
      label: 'Контейнер',
      placeholder: 'Выберите контейнер',
      options: containerOptions
    },
    {
      type: 'select' as const,
      fieldName: 'size_id' as const,
      label: 'Размер',
      options: sizes.map((size: Size) => ({
        label: size.name,
        value: size.id
      }))
    },
    {
      type: 'input' as const,
      fieldName: 'comment' as const,
      label: 'Комментарий',
      placeholder: 'Комментарий...'
    }
  ];

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={modal.openCreate}>
          Добавить ячейку
        </Button>
      </div>

      {/* Таблица */}
      <div className="rounded-md border">
        <BaseTable
          data={cells}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Поиск по названию ячейки..."
          onEdit={modal.openEdit}
          onDelete={handleDelete}
          tableId="cells-table"
          totalCount={totalCount}
          pageCount={pageCount}
          onPaginationChange={tableControls.handlePaginationChange}
          onSortingChange={tableControls.handleSortingChange}
          onSearchChange={tableControls.handleSearchChange}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          sortableFields={ImportedCellSortField}
          pagination={tableControls.pagination}
          sorting={tableControls.sorting}
          persistSettings={true}
        />
      </div>

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать ячейку' : 'Добавить ячейку'}
        fields={modalFields}
        validationSchema={cellValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          name: modal.editItem.name,
          containerId: modal.editItem.containerId,
          size_id: modal.editItem.size_id,
          comment: modal.editItem.comment || ''
        } : {
          name: '',
          containerId: '',
          size_id: '',
          comment: ''
        }}
      />
    </>
  );
}