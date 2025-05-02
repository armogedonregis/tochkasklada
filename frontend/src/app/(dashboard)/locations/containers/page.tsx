'use client';

import { useState } from 'react';
import { useGetContainersQuery, useDeleteContainerMutation, useAddContainerMutation, useUpdateContainerMutation } from '@/services/containersApi';
import { useGetLocationsQuery } from '@/services/locationsApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseLocationModal } from '@/components/modals/BaseLocationModal';
import { ColumnDef } from '@tanstack/react-table';
import { Container, CreateContainerDto } from '@/services/containersApi';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const containerValidationSchema = yup.object({
  id: yup.string()
    .required('ID контейнера обязателен')
    .matches(/^(0[1-9]|[1-9][0-9])$/, 'ID должен быть в формате 01-99'),
  locId: yup.string().required('Выберите локацию')
});

// Тип для полей формы
type ContainerFormFields = {
  id: string;
  locId: string;
};

export default function ContainersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  
  const { data: containers = [], error, isLoading } = useGetContainersQuery();
  const { data: locations = [], isLoading: isLocationsLoading } = useGetLocationsQuery();
  const [deleteContainer] = useDeleteContainerMutation();
  const [addContainer] = useAddContainerMutation();
  const [updateContainer] = useUpdateContainerMutation();

  // Вспомогательные функции
  const getLocationInfo = (locId: string) => {
    return locations.find(location => location.id === locId);
  };

  // Определение колонок таблицы
  const columns: ColumnDef<Container>[] = [
    {
      id: 'id',
      header: 'Номер',
      cell: ({ row }) => {
        const id = row.original.id;
        // Форматируем номер с лидирующим нулем если нужно
        return `${id < 10 ? `0${id}` : id}`;
      },
    },
    {
      id: 'location',
      header: 'Локация',
      cell: ({ row }) => {
        const location = getLocationInfo(row.original.locId);
        return location?.name || 'Не указана';
      },
    },
    {
      id: 'city',
      header: 'Город',
      cell: ({ row }) => {
        const location = getLocationInfo(row.original.locId);
        return location?.city?.title || 'Не указан';
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingContainer(row.original)}
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
  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот контейнер?')) {
      try {
        await deleteContainer(id).unwrap();
        toast.success('Контейнер успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении контейнера');
      }
    }
  };

  const handleSubmit = async (data: ContainerFormFields) => {
    try {
      // Преобразуем id из строки в число
      const idNumber = parseInt(data.id, 10);
      
      if (editingContainer) {
        await updateContainer({ 
          id: editingContainer.id, 
          locId: data.locId 
        }).unwrap();
        toast.success('Контейнер успешно обновлен');
      } else {
        await addContainer({
          id: idNumber,
          locId: data.locId
        }).unwrap();
        toast.success('Контейнер успешно добавлен');
      }
      setIsModalOpen(false);
      setEditingContainer(null);
    } catch (error) {
      toast.error(editingContainer 
        ? 'Ошибка при обновлении контейнера' 
        : 'Ошибка при добавлении контейнера');
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

  if (isLoading || isLocationsLoading) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl mb-2">Загрузка данных...</h3>
        <p className="text-gray-500">Пожалуйста, подождите</p>
      </div>
    );
  }

  // Находим максимальный ID для предложения следующего номера
  const getNextId = () => {
    if (containers.length === 0) return '01';
    const maxId = Math.max(...containers.map(c => c.id));
    const nextId = maxId + 1;
    return nextId < 10 ? `0${nextId}` : `${nextId}`;
  };

  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'id' as const,
      label: 'ID контейнера',
      placeholder: 'Например: 01',
      defaultValue: !editingContainer ? getNextId() : undefined
    },
    {
      type: 'select' as const,
      fieldName: 'locId' as const,
      label: 'Локация',
      options: locations.map(location => ({
        label: location.name,
        value: location.id
      }))
    }
  ];

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsModalOpen(true)}>
          Добавить контейнер
        </Button>
      </div>

      {/* Таблица */}
      <BaseTable
        data={containers}
        columns={columns}
        searchColumn="id"
        searchPlaceholder="Поиск по номеру контейнера..."
      />

      {/* Модальное окно */}
      <BaseLocationModal
        isOpen={isModalOpen || !!editingContainer}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContainer(null);
        }}
        title={editingContainer ? 'Редактировать контейнер' : 'Добавить контейнер'}
        fields={modalFields}
        validationSchema={containerValidationSchema}
        onSubmit={handleSubmit}
        submitText={editingContainer ? 'Сохранить' : 'Добавить'}
        defaultValues={editingContainer ? {
          id: editingContainer.id < 10 ? `0${editingContainer.id}` : `${editingContainer.id}`,
          locId: editingContainer.locId
        } : undefined}
      />
    </>
  );
} 