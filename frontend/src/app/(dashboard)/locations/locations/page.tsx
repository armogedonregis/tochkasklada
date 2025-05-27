'use client';

import { MouseEvent } from 'react';
import { useGetLocationsQuery, useDeleteLocationMutation, useAddLocationMutation, useUpdateLocationMutation } from '@/services/locationsService/locationsApi';
import { useGetCitiesQuery } from '@/services/citiesService/citiesApi';
import { Location, CreateLocationDto, LocationSortField } from '@/services/locationsService/location.types';
import { City } from '@/services/citiesService/city.types';
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

// Схема валидации для локаций
const locationValidationSchema = yup.object({
  name: yup.string().required('Название локации обязательно'),
  short_name: yup.string().required('Короткое название обязательно'),
  address: yup.string().optional(),
  cityId: yup.string().required('Выберите город')
});

export default function LocationsPage() {
  // ====== ХУКИ ДЛЯ ДАННЫХ И ТАБЛИЦЫ ======
  const tableControls = useTableControls<LocationSortField>({
    defaultPageSize: 10
  });

  const { data, isLoading, error, refetch } = useGetLocationsQuery(
    tableControls.queryParams
  );
  
  const locations = data?.data || [];
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 0;
  
  // Получение списка городов для селектора
  const { data: citiesData = { data: [] }, isLoading: isCitiesLoading } = useGetCitiesQuery();
  const cities = citiesData.data;
  
  const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();
  const [addLocation, { isLoading: isAdding }] = useAddLocationMutation();
  const [updateLocation, { isLoading: isUpdating }] = useUpdateLocationMutation();

  // ====== ХУКИ ДЛЯ МОДАЛЬНЫХ ОКОН ======
  const deleteModal = useDeleteModal();

  const modal = useFormModal<CreateLocationDto, Location>({
    // Автоматическое преобразование локации в формат формы
    itemToFormData: (location) => ({
      name: location.name,
      short_name: location.short_name,
      address: location.address,
      cityId: location.cityId,
    }),
    onSubmit: async (values: CreateLocationDto) => {
      try {
        const sanitizedValues = {
          name: values.name,
          short_name: values.short_name,
          address: values.address,
          cityId: values.cityId,
        };
        if (modal.editItem) {
          await updateLocation({ id: modal.editItem.id, ...sanitizedValues }).unwrap();
          ToastService.success('Локация успешно обновлена');
        } else {
          await addLocation(sanitizedValues).unwrap();
          ToastService.success('Локация успешно добавлена');
        }
      } catch (error) {
        ToastService.error('Ошибка при сохранении локации');
      }
    }
  });

  // ====== ОБРАБОТЧИКИ СОБЫТИЙ ======
  const handleDelete = async () => {
    if (!deleteModal.entityId) return;
    
    deleteModal.setLoading(true);
    try {
      await deleteLocation(deleteModal.entityId).unwrap();
      ToastService.success('Локация успешно удалена');
      deleteModal.resetModal();
    } catch (error) {
      ToastService.error('Ошибка при удалении локации');
    } finally {
      deleteModal.setLoading(false);
    }
  };

  const openDeleteModal = (location: Location) => {
    deleteModal.openDelete(location.id, location.name);
  };

  const handleCreateClick = (e: MouseEvent<HTMLButtonElement>) => {
    modal.openCreate();
  };

  // ====== ОПРЕДЕЛЕНИЯ UI КОМПОНЕНТОВ ======
  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'Название локации',
      placeholder: 'Введите название'
    },
    {
      type: 'input' as const,
      fieldName: 'short_name' as const,
      label: 'Короткое название',
      placeholder: 'Введите короткое название'
    },
    {
      type: 'input' as const,
      fieldName: 'address' as const,
      label: 'Адрес',
      placeholder: 'Введите адрес'
    },
    {
      type: 'select' as const,
      fieldName: 'cityId' as const,
      label: 'Город',
      options: cities.map((city: City) => ({
        label: city.title,
        value: city.id
      }))
    }
  ];

  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      accessorKey: 'short_name',
      header: 'Короткое название',
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
    },
    {
      accessorKey: 'city',
      id: 'city',
      header: 'Город',
      cell: ({ row }) => row.original.city?.title || 'Не указан',
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
    }
  ];

  // ====== РЕНДЕР СТРАНИЦЫ ======
  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={handleCreateClick}>
          Добавить локацию
        </Button>
      </div>

      {/* Таблица */}
      <BaseTable
        data={locations}
        columns={columns}
        searchColumn="name"
        searchPlaceholder="Поиск по названию локации..."
        onEdit={modal.openEdit}
        onDelete={openDeleteModal}
        tableId="locations-table"
        totalCount={totalCount}
        pageCount={pageCount}
        onPaginationChange={tableControls.handlePaginationChange}
        onSortingChange={tableControls.handleSortingChange}
        onSearchChange={tableControls.handleSearchChange}
        isLoading={isLoading || isCitiesLoading}
        error={error}
        onRetry={refetch}
        sortableFields={LocationSortField}
        pagination={tableControls.pagination}
        sorting={tableControls.sorting}
        persistSettings={true}
      />

      {/* Модальное окно формы */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать локацию' : 'Добавить локацию'}
        fields={modalFields}
        validationSchema={locationValidationSchema}
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
        entityName={deleteModal.entityName || 'локацию'}
        isLoading={isDeleting || deleteModal.isLoading}
      />
    </>
  );
}