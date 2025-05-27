'use client';

import { MouseEvent } from 'react';
import { useGetCitiesQuery, useDeleteCityMutation, useAddCityMutation, useUpdateCityMutation } from '@/services/citiesService/citiesApi';
import { City, CitySortField, CreateCityDto, UpdateCityDto } from '@/services/citiesService/city.types';
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

// Схема валидации для городов
const cityValidationSchema = yup.object({
  title: yup.string().required('Название города обязательно'),
  short_name: yup.string().required('Короткое название обязательно')
});

export default function CitiesPage() {
  // ====== ХУКИ ДЛЯ ДАННЫХ И ТАБЛИЦЫ ======
  const tableControls = useTableControls<CitySortField>({
    defaultPageSize: 10
  });

  const { data, isLoading, error, refetch } = useGetCitiesQuery(
    tableControls.queryParams
  );

  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();
  const [addCity, { isLoading: isAdding }] = useAddCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();

  // ====== ХУКИ ДЛЯ МОДАЛЬНЫХ ОКОН ======
  const deleteModal = useDeleteModal();

  const modal = useFormModal<CreateCityDto, City>({
    // Автоматическое преобразование города в формат формы
    itemToFormData: (city) => ({
      title: city.title,
      short_name: city.short_name
    }),
    onSubmit: async (values: CreateCityDto) => {
      try {
        const sanitizedValues = {
          title: values.title,
          short_name: values.short_name
        };
        if (modal.editItem) {
          await updateCity({ id: modal.editItem.id, ...sanitizedValues }).unwrap();
          ToastService.success('Город успешно обновлен');
        } else {
          await addCity(sanitizedValues).unwrap();
          ToastService.success('Город успешно добавлен');
        }
      } catch (error) {
        ToastService.error('Ошибка при сохранении города');
      }
    }
  });

  // ====== ОБРАБОТЧИКИ СОБЫТИЙ ======
  const handleDelete = async () => {
    if (!deleteModal.entityId) return;

    deleteModal.setLoading(true);
    try {
      await deleteCity(deleteModal.entityId).unwrap();
      ToastService.success('Город успешно удален');
      deleteModal.resetModal();
    } catch (error) {
      ToastService.error('Ошибка при удалении города');
    } finally {
      deleteModal.setLoading(false);
    }
  };

  const openDeleteModal = (city: City) => {
    deleteModal.openDelete(city.id, city.title);
  };

  const handleCreateClick = (e: MouseEvent<HTMLButtonElement>) => {
    modal.openCreate();
  };

  // ====== ОПРЕДЕЛЕНИЯ UI КОМПОНЕНТОВ ======
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

  // ====== РЕНДЕР СТРАНИЦЫ ======
  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={handleCreateClick}>
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
        onDelete={openDeleteModal}
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

      {/* Модальное окно формы */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать город' : 'Добавить город'}
        fields={modalFields}
        validationSchema={cityValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        formData={modal.formData}
        isLoading={isAdding || isUpdating}
        defaultValues={modal.editItem ? modal.editItem : undefined}
      />

      {/* Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        entityName={deleteModal.entityName || 'город'}
        isLoading={isDeleting || deleteModal.isLoading}
      />
    </>
  );
} 