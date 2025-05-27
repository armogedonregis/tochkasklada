'use client';

import { useState, MouseEvent, useEffect, useRef } from 'react';
import { useGetAdminCellsQuery, useDeleteCellMutation, useAddCellMutation, useUpdateCellMutation } from '@/services/cellService/cellsApi';
import { useGetContainersQuery } from '@/services/containersService/containersApi';
import { useGetSizesQuery } from '@/services/sizesService/sizesApi';
import { Cell, CreateCellDto, CellFilters, CellSortField as ImportedCellSortField } from '@/services/cellService/cell.types';
import { Container } from '@/services/containersService/container.types';
import { Size } from '@/services/sizesService/sizes.types';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { ColumnDef } from '@tanstack/react-table';
import * as yup from 'yup';
import { ToastService } from '@/components/toast/ToastService';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';

// Схема валидации для ячеек
const cellValidationSchema = yup.object({
  name: yup.string().required('Название ячейки обязательно'),
  containerId: yup.string().required('Выберите контейнер'),
  size_id: yup.string().required('Выберите размер'),
  comment: yup.string().optional()
});

export default function CellsPage() {
  // ====== ХУКИ ДЛЯ ДАННЫХ И ТАБЛИЦЫ ======
  const tableControls = useTableControls<ImportedCellSortField>({
    defaultPageSize: 10,
    searchDebounceMs: 300
  });
  
  // Преобразуем параметры запроса из useTableControls в формат для cellsApi
  const cellFilters: CellFilters = {
    ...tableControls.queryParams
  };
  
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

  // ====== ХУКИ ДЛЯ МОДАЛЬНЫХ ОКОН ======
  const deleteModal = useDeleteModal();

  const modal = useFormModal<CreateCellDto, Cell>({
    // Автоматическое преобразование ячейки в формат формы
    itemToFormData: (cell) => ({
      name: cell.name,
      containerId: cell.containerId,
      size_id: cell.size_id,
      comment: cell.comment || ''
    }),
    onSubmit: async (values) => {
      try {
        if (modal.editItem) {
          await updateCell({ 
            id: modal.editItem.id,
            name: values.name,
            containerId: values.containerId,
            size_id: values.size_id,
            comment: values.comment
          }).unwrap();
          ToastService.success('Ячейка успешно обновлена');
        } else {
          await addCell({
            name: values.name,
            containerId: values.containerId,
            size_id: values.size_id,
            comment: values.comment
          }).unwrap();
          ToastService.success('Ячейка успешно добавлена');
        }
      } catch (error) {
        ToastService.error('Ошибка при сохранении ячейки');
      }
    }
  });

  // ====== ОБРАБОТЧИКИ СОБЫТИЙ ======
  const handleDelete = async (cell: Cell) => {
    if (window.confirm('Вы уверены, что хотите удалить эту ячейку?')) {
      try {
        await deleteCell(cell.id).unwrap();
        ToastService.success('Ячейка успешно удалена');
      } catch (error) {
        ToastService.error('Ошибка при удалении ячейки');
      }
    }
  };
  
  const handleCreateClick = (e: MouseEvent<HTMLButtonElement>) => {
    modal.openCreate();
  };
  
  // Функция для генерации имени ячейки на основе выбранного контейнера
  const getNextCellName = (containerId: string) => {
    // Находим контейнер по ID
    const container = containersList.find((c: Container) => c.id === containerId);
    if (!container) return '';
    
    // Форматируем номер контейнера
    const containerName = typeof container.name === 'number'
      ? (container.name < 10 ? `0${container.name}` : `${container.name}`)
      : container.name;
    
    // Получаем все ячейки для этого контейнера
    const containerCells = cells.filter(cell => cell.containerId === containerId);
    
    // Если ячеек нет, предлагаем первую букву
    if (containerCells.length === 0) {
      return `${containerName}A`;
    }
    
    // Находим последнюю использованную букву
    const cellNames = containerCells.map(cell => cell.name);
    // Предполагаем, что имя ячейки заканчивается на букву (например, 01A, 02B и т.д.)
    const letters = cellNames
      .map(name => name.charAt(name.length - 1))
      .filter(char => /[A-Z]/.test(char))
      .sort();
    
    // Берем последнюю букву и увеличиваем ее на одну
    if (letters.length > 0) {
      const lastLetter = letters[letters.length - 1];
      const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
      // Если дошли до конца алфавита, начинаем снова с A
      return `${containerName}${nextLetter <= 'Z' ? nextLetter : 'A'}`;
    }
    
    return `${containerName}A`;
  };

  // ====== ОПРЕДЕЛЕНИЯ UI КОМПОНЕНТОВ ======
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

  // Поля формы для модального окна
  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'Название ячейки',
      placeholder: 'Например: 01A, 02B и т.д.'
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
        label: size.name + " (" + size.short_name + ")",
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

  // Определение колонок таблицы
  const columns: ColumnDef<Cell>[] = [
    {
      accessorKey: 'name',
      header: 'Ячейка',
    },
    {
      accessorKey: 'size',
      id: 'size',
      header: 'Размер',
      cell: ({ row }) => {
        const sizeId = row.original.size_id;
        const size = sizes.find((s: Size) => s.id === sizeId);
        return size?.name || 'Не указан';
      },
    },
    {
      accessorKey: 'container',
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
      accessorKey: 'location',
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
      accessorKey: 'city',
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
      accessorKey: 'comment',
      header: 'Комментарий',
      cell: ({ row }) => row.original.comment || '-',
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

  // ====== РЕНДЕР СТРАНИЦЫ ======
  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={handleCreateClick}>
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
        formData={modal.formData}
        isLoading={false}
        defaultValues={modal.editItem ? modal.editItem : undefined}
      />
    </>
  );
}