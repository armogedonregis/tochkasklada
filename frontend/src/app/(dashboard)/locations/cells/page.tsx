'use client';

import { useState } from 'react';
import { useGetCellsQuery, useDeleteCellMutation } from '@/services/cellsApi';
import { useGetContainersQuery } from '@/services/containersApi';
import { useGetLocationsQuery } from '@/services/locationsApi';
import { useGetSizesQuery } from '@/services/sizesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseLocationModal } from '@/components/modals/BaseLocationModal';
import { ColumnDef } from '@tanstack/react-table';
import { Cell } from '@/services/cellsApi';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const cellValidationSchema = yup.object({
  name: yup.string().required('Название ячейки обязательно'),
  containerId: yup.number().required('Выберите контейнер'),
  size_id: yup.string().required('Выберите размер'),
  len_height: yup.string().required('Укажите размеры')
});

export default function CellsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<Cell | null>(null);
  
  const { data: cells = [], error, isLoading } = useGetCellsQuery();
  const { data: containers = [] } = useGetContainersQuery();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: sizes = [] } = useGetSizesQuery();
  const [deleteCell] = useDeleteCellMutation();

  // Вспомогательные функции
  const getContainerInfo = (containerId: number) => {
    return containers.find(container => container.id === containerId);
  };

  const getLocationInfo = (locId: string) => {
    return locations.find(location => location.id === locId);
  };

  const getSizeInfo = (sizeId: string) => {
    return sizes.find(size => size.id === sizeId);
  };

  // Определение колонок таблицы
  const columns: ColumnDef<Cell>[] = [
    {
      accessorKey: 'name',
      header: 'Ячейка',
    },
    {
      accessorKey: 'len_height',
      header: 'Размеры',
    },
    {
      id: 'size',
      header: 'Тип размера',
      cell: ({ row }) => {
        const size = getSizeInfo(row.original.size_id);
        return size?.name || 'Не указан';
      },
    },
    {
      id: 'container',
      header: 'Контейнер',
      cell: ({ row }) => `Контейнер №${row.original.containerId}`,
    },
    {
      id: 'location',
      header: 'Локация',
      cell: ({ row }) => {
        const container = getContainerInfo(row.original.containerId);
        const location = container ? getLocationInfo(container.locId) : undefined;
        return location?.name || 'Не указана';
      },
    },
    {
      id: 'city',
      header: 'Город',
      cell: ({ row }) => {
        const container = getContainerInfo(row.original.containerId);
        const location = container ? getLocationInfo(container.locId) : undefined;
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
            onClick={() => setEditingCell(row.original)}
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
    if (window.confirm('Вы уверены, что хотите удалить эту ячейку?')) {
      try {
        await deleteCell(id).unwrap();
        toast.success('Ячейка успешно удалена');
      } catch (error) {
        toast.error('Ошибка при удалении ячейки');
      }
    }
  };

  const handleSubmit = async (data: any) => {
    // TODO: Реализовать создание/редактирование ячейки
    console.log(data);
    setIsModalOpen(false);
    setEditingCell(null);
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
      fieldName: 'name',
      label: 'Название ячейки',
      placeholder: 'Например: A1'
    },
    {
      type: 'select' as const,
      fieldName: 'containerId',
      label: 'Контейнер',
      options: containers.map(container => ({
        label: `Контейнер №${container.id}`,
        value: container.id
      }))
    },
    {
      type: 'select' as const,
      fieldName: 'size_id',
      label: 'Размер',
      options: sizes.map(size => ({
        label: size.name,
        value: size.id
      }))
    },
    {
      type: 'input' as const,
      fieldName: 'len_height',
      label: 'Размеры',
      placeholder: '2x2,4x1,75'
    }
  ];

  return (
    <>
      {/* Панель поиска и добавления */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsModalOpen(true)}>
          Добавить ячейку
        </Button>
      </div>

      {/* Таблица */}
      <BaseTable
        data={cells}
        columns={columns}
        searchColumn="name"
        searchPlaceholder="Поиск по названию ячейки..."
      />

      {/* Модальное окно */}
      <BaseLocationModal
        isOpen={isModalOpen || !!editingCell}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCell(null);
        }}
        title={editingCell ? 'Редактировать ячейку' : 'Добавить ячейку'}
        fields={modalFields}
        validationSchema={cellValidationSchema}
        onSubmit={handleSubmit}
        submitText={editingCell ? 'Сохранить' : 'Добавить'}
      />
    </>
  );
} 