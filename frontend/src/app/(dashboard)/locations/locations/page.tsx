'use client';

import { useState } from 'react';
import { useGetLocationsQuery, useDeleteLocationMutation, useAddLocationMutation, useUpdateLocationMutation } from '@/services/locationsApi';
import { useGetCitiesQuery } from '@/services/citiesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseLocationModal } from '@/components/modals/BaseLocationModal';
import { ColumnDef } from '@tanstack/react-table';
import { Location, CreateLocationDto } from '@/services/locationsApi';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const locationValidationSchema = yup.object({
  name: yup.string().required('Название локации обязательно'),
  short_name: yup.string().required('Короткое название обязательно'),
  address: yup.string().required('Адрес обязателен'),
  cityId: yup.string().required('Выберите город')
});

// Определяем тип полей формы для типизации
type LocationFormFields = {
  name: string;
  short_name: string;
  address: string;
  cityId: string;
};

export default function LocationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  const { data: locations = [], error, isLoading } = useGetLocationsQuery();
  const { data: cities = [], isLoading: isCitiesLoading } = useGetCitiesQuery();
  const [deleteLocation] = useDeleteLocationMutation();
  const [addLocation] = useAddLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();

  // Определение колонок таблицы
  const columns: ColumnDef<Location>[] = [
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
      id: 'city',
      header: 'Город',
      cell: ({ row }) => row.original.city?.title || 'Не указан',
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingLocation(row.original)}
          >
            <Pencil size={16} className="mr-1" /> Изменить
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 size={16} className="mr-1" /> Удалить
          </Button>
        </div>
      ),
    },
  ];

  // Обработчики действий
  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту локацию?')) {
      try {
        await deleteLocation(id).unwrap();
        toast.success('Локация успешно удалена');
      } catch (error) {
        toast.error('Ошибка при удалении локации');
      }
    }
  };

  const handleSubmit = async (data: LocationFormFields) => {
    try {
      if (editingLocation) {
        await updateLocation({ id: editingLocation.id, ...data }).unwrap();
        toast.success('Локация успешно обновлена');
      } else {
        await addLocation(data).unwrap();
        toast.success('Локация успешно добавлена');
      }
      setIsModalOpen(false);
      setEditingLocation(null);
    } catch (error) {
      toast.error(editingLocation 
        ? 'Ошибка при обновлении локации' 
        : 'Ошибка при добавлении локации');
    }
  };

  // Состояния загрузки и ошибки
  if (error) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl text-red-500 mb-2">Ошибка при загрузке данных</h3>
        <p className="text-gray-500 mb-4">Не удалось загрузить данные с сервера</p>
        <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
      </div>
    );
  }

  if (isLoading || isCitiesLoading) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl mb-2">Загрузка данных...</h3>
        <p className="text-gray-500">Пожалуйста, подождите</p>
      </div>
    );
  }

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

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsModalOpen(true)}>
          Добавить локацию
        </Button>
      </div>

      {/* Таблица */}
      <BaseTable
        data={locations}
        columns={columns}
        searchColumn="name"
        searchPlaceholder="Поиск по названию локации..."
      />

      {/* Модальное окно */}
      <BaseLocationModal
        isOpen={isModalOpen || !!editingLocation}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
        title={editingLocation ? 'Редактировать локацию' : 'Добавить локацию'}
        fields={modalFields}
        validationSchema={locationValidationSchema}
        onSubmit={handleSubmit}
        submitText={editingLocation ? 'Сохранить' : 'Добавить'}
        defaultValues={editingLocation ? {
          name: editingLocation.name,
          short_name: editingLocation.short_name,
          address: editingLocation.address,
          cityId: editingLocation.cityId,
        } : undefined}
      />
    </>
  );
}