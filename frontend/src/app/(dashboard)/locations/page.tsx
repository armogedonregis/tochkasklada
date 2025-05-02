'use client';

import { useState } from 'react';
import { useGetCitiesQuery, useDeleteCityMutation, useAddCityMutation, useUpdateCityMutation } from '@/services/citiesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseLocationModal } from '@/components/modals/BaseLocationModal';
import { ColumnDef } from '@tanstack/react-table';
import { City } from '@/services/citiesApi';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const cityValidationSchema = yup.object({
  title: yup.string().required('Название города обязательно'),
  short_name: yup.string().required('Короткое название обязательно')
});

export default function CitiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  
  const { data: cities = [], error, isLoading } = useGetCitiesQuery();
  const [deleteCity] = useDeleteCityMutation();
  const [addCity] = useAddCityMutation();
  const [updateCity] = useUpdateCityMutation();

  // Определение колонок таблицы
  const columns: ColumnDef<City>[] = [
    {
      accessorKey: 'title',
      header: 'Название',
    },
    {
      accessorKey: 'short_name',
      header: 'Короткое название',
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingCity(row.original)}
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
    if (window.confirm('Вы уверены, что хотите удалить этот город?')) {
      try {
        await deleteCity(id).unwrap();
        toast.success('Город успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении города');
      }
    }
  };

  const handleSubmit = async (data: { title: string; short_name: string }) => {
    try {
      if (editingCity) {
        await updateCity({ id: editingCity.id, ...data }).unwrap();
        toast.success('Город успешно обновлен');
      } else {
        await addCity(data).unwrap();
        toast.success('Город успешно добавлен');
      }
      setIsModalOpen(false);
      setEditingCity(null);
    } catch (error) {
      toast.error(editingCity ? 'Ошибка при обновлении города' : 'Ошибка при добавлении города');
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

  if (isLoading) {
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
      fieldName: 'title' as const,
      label: 'Название города',
      placeholder: 'Введите название'
    },
    {
      type: 'input' as const,
      fieldName: 'short_name' as const,
      label: 'Короткое название',
      placeholder: 'Введите короткое название'
    }
  ];

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsModalOpen(true)}>
          Добавить город
        </Button>
      </div>

      {/* Таблица */}
      <BaseTable
        data={cities}
        columns={columns}
        searchColumn="title"
        searchPlaceholder="Поиск по названию города..."
      />

      {/* Модальное окно */}
      <BaseLocationModal
        isOpen={isModalOpen || !!editingCity}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCity(null);
        }}
        title={editingCity ? 'Редактировать город' : 'Добавить город'}
        fields={modalFields}
        validationSchema={cityValidationSchema}
        onSubmit={handleSubmit}
        submitText={editingCity ? 'Сохранить' : 'Добавить'}
        defaultValues={editingCity ? {
          title: editingCity.title,
          short_name: editingCity.short_name
        } : undefined}
      />
    </>
  );
} 