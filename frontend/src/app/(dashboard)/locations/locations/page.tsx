'use client';

import { useGetLocationsQuery, useDeleteLocationMutation, useAddLocationMutation, useUpdateLocationMutation } from '@/services/locationsService/locationsApi';
import { useGetCitiesQuery } from '@/services/citiesService/citiesApi';
import { Button } from '@/components/ui/button';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { BaseTable } from '@/components/table/BaseTable';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';
import { Location, CreateLocationDto, LocationSortField } from '@/services/locationsService/location.types';
// Схема валидации для локаций
const locationValidationSchema = yup.object({
  name: yup.string().required('Название локации обязательно'),
  short_name: yup.string().required('Короткое название обязательно'),
  address: yup.string().optional(),
  cityId: yup.string().required('Выберите город')
});

export default function LocationsPage() {
  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<LocationSortField>({
    defaultPageSize: 10
  });

  // Получение данных локаций с учетом пагинации, сортировки и поиска
  const { data, isLoading, error, refetch } = useGetLocationsQuery(
    tableControls.queryParams
  );
  
  const locations = data?.data || [];
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 0;
  
  // Получение списка городов для селектора
  const { data: citiesData = { data: [] }, isLoading: isCitiesLoading } = useGetCitiesQuery();
  const cities = citiesData.data;
  
  // Мутации для CRUD операций
  const [deleteLocation] = useDeleteLocationMutation();
  const [addLocation] = useAddLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<CreateLocationDto, Location>({
    onSubmit: async (values) => {
      if (modal.editItem) {
        await updateLocation({ id: modal.editItem.id, ...values }).unwrap();
        toast.success('Локация успешно обновлена');
      } else {
        await addLocation(values).unwrap();
        toast.success('Локация успешно добавлена');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении локации');
    }
  });

  // Обработчик удаления
  const handleDelete = async (location: Location) => {
    if (window.confirm('Вы уверены, что хотите удалить эту локацию?')) {
      try {
        await deleteLocation(location.id).unwrap();
        toast.success('Локация успешно удалена');
      } catch (error) {
        toast.error('Ошибка при удалении локации');
      }
    }
  };

  // Поля формы
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
      options: cities.map(city => ({
        label: city.title,
        value: city.id
      }))
    }
  ];

  // Определение колонок таблицы
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

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={modal.openCreate}>
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
        onDelete={handleDelete}
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

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать локацию' : 'Добавить локацию'}
        fields={modalFields}
        validationSchema={locationValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          name: modal.editItem.name,
          short_name: modal.editItem.short_name,
          address: modal.editItem.address,
          cityId: modal.editItem.cityId,
        } : undefined}
      />
    </>
  );
}