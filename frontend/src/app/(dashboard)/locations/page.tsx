'use client';

import { useGetCitiesQuery, useDeleteCityMutation, useAddCityMutation, useUpdateCityMutation } from '@/services/citiesApi';
import { Button } from '@/components/ui/button';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { City, CreateCityDto } from '@/types/city.types';
import { CitySortField } from '@/types/city.types';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { BaseTable } from '@/components/table/BaseTable';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';

// Схема валидации для городов
const cityValidationSchema = yup.object({
  title: yup.string().required('Название города обязательно'),
  short_name: yup.string().required('Короткое название обязательно')
});

export default function CitiesPage() {
  // Используем наш новый хук для управления состоянием таблицы
  const tableControls = useTableControls<CitySortField>({
    defaultPageSize: 10
  });

  // Получение данных с учетом пагинации, сортировки и поиска
  const { data, isLoading, error, refetch } = useGetCitiesQuery(
    tableControls.queryParams
  );

  const [deleteCity] = useDeleteCityMutation();
  const [addCity] = useAddCityMutation();
  const [updateCity] = useUpdateCityMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<CreateCityDto, City>({
    onSubmit: async (values) => {
      if (modal.editItem) {
        await updateCity({ id: modal.editItem.id, ...values }).unwrap();
        toast.success('Город успешно обновлен');
      } else {
        await addCity(values).unwrap();
        toast.success('Город успешно добавлен');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении города');
    }
  });

  const handleDelete = async (city: City) => {
    try {
      await deleteCity(city.id).unwrap();
      toast.success('Город успешно удален');
    } catch (error) {
      toast.error('Ошибка при удалении города');
    }
  };

  const handleDeleteConfirm = (city: City) => {
    if (window.confirm('Вы уверены, что хотите удалить этот город?')) {
      handleDelete(city);
    }
  };

  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'title' as const,
      label: 'Название города',
      placeholder: 'Введите название города',
    },
    {
      type: 'input' as const,
      fieldName: 'short_name' as const,
      label: 'Короткое название',
      placeholder: 'Введите короткое название',
    },
  ];

  const columns: ColumnDef<City>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'title',
      header: 'Название',
    },
    {
      accessorKey: 'short_name',
      header: 'Короткое название',
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания',
      cell: ({ row }) => new Date(row.original.createdAt!).toLocaleDateString('ru-RU'),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Дата обновления',
      cell: ({ row }) => row.original.updatedAt 
        ? new Date(row.original.updatedAt).toLocaleDateString('ru-RU') 
        : '-',
    }
  ];

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={modal.openCreate}>
          Добавить город
        </Button>
      </div>

      {/* Таблица */}
      <BaseTable
        data={data?.data || []}
        columns={columns}
        searchColumn="title"
        searchPlaceholder="Поиск по названию города..."
        onEdit={modal.openEdit}
        onDelete={handleDeleteConfirm}
        tableId="cities-table"
        totalCount={data?.meta.totalCount || 0}
        pageCount={data?.meta.totalPages || 0}
        onPaginationChange={tableControls.handlePaginationChange}
        onSortingChange={tableControls.handleSortingChange}
        onSearchChange={tableControls.handleSearchChange}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        sortableFields={CitySortField}
        pagination={tableControls.pagination}
        sorting={tableControls.sorting}
      />

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать город' : 'Добавить город'}
        fields={modalFields}
        validationSchema={cityValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          title: modal.editItem.title,
          short_name: modal.editItem.short_name
        } : undefined}
      />
    </>
  );
} 