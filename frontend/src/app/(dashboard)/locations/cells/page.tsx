'use client';

import { useState } from 'react';
import { useGetCellsQuery, useDeleteCellMutation, useAddCellMutation, useUpdateCellMutation } from '@/services/cellsApi';
import { useGetContainersQuery } from '@/services/containersApi';
import { useGetLocationsQuery } from '@/services/locationsApi';
import { useGetSizesQuery } from '@/services/sizesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseLocationModal } from '@/components/modals/BaseLocationModal';
import { ColumnDef } from '@tanstack/react-table';
import { Cell, CreateCellRequest } from '@/services/cellsApi';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const cellValidationSchema = yup.object({
  name: yup.string().required('Название ячейки обязательно'),
  containerId: yup.number().required('Выберите контейнер'),
  size_id: yup.string().required('Выберите размер'),
  len_height: yup.string().required('Укажите размеры')
});

// Тип для полей формы
type CellFormFields = {
  name: string;
  containerId: number;
  size_id: string;
  len_height: string;
};

export default function CellsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<Cell | null>(null);
  
  const { data: cells = [], error, isLoading } = useGetCellsQuery();
  const { data: containers = [] } = useGetContainersQuery();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: sizes = [] } = useGetSizesQuery();
  const [deleteCell] = useDeleteCellMutation();
  const [addCell] = useAddCellMutation();
  const [updateCell] = useUpdateCellMutation();

  // Вспомогательные функции
  const getContainerInfo = (containerId: number) => {
    return containers.find(container => container.id === containerId);
  };

  const getLocationInfo = (locId?: string) => {
    if (!locId) return undefined;
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
      cell: ({ row }) => {
        const id = row.original.containerId;
        // Форматируем номер с лидирующим нулем если нужно
        return `${id < 10 ? `0${id}` : id}`;
      },
    },
    {
      id: 'location',
      header: 'Локация',
      cell: ({ row }) => {
        const container = getContainerInfo(row.original.containerId);
        const location = container && container.locId ? getLocationInfo(container.locId) : undefined;
        return location?.name || 'Не указана';
      },
    },
    {
      id: 'city',
      header: 'Город',
      cell: ({ row }) => {
        const container = getContainerInfo(row.original.containerId);
        const location = container && container.locId ? getLocationInfo(container.locId) : undefined;
        return location?.city?.title || 'Не указан';
      },
    },
  ];

  // Обработчики действий
  const handleEdit = (cell: Cell) => {
    setEditingCell(cell);
    setIsModalOpen(true);
  };

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

  const handleDeleteAdapter = (cell: Cell) => {
    handleDelete(cell.id);
  };

  const handleSubmit = async (data: CellFormFields) => {
    try {
      if (editingCell) {
        await updateCell({ 
          id: editingCell.id, 
          ...data,
          containerId: Number(data.containerId) // Убедимся, что containerId - число
        }).unwrap();
        toast.success('Ячейка успешно обновлена');
      } else {
        await addCell({
          ...data,
          containerId: Number(data.containerId) // Убедимся, что containerId - число
        }).unwrap();
        toast.success('Ячейка успешно добавлена');
      }
      setIsModalOpen(false);
      setEditingCell(null);
    } catch (error) {
      toast.error(editingCell 
        ? 'Ошибка при обновлении ячейки' 
        : 'Ошибка при добавлении ячейки');
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
      fieldName: 'name' as const,
      label: 'Название ячейки',
      placeholder: 'Например: A1'
    },
    {
      type: 'select' as const,
      fieldName: 'containerId' as const,
      label: 'Контейнер',
      options: containers.map(container => ({
        label: `${container.id < 10 ? `0${container.id}` : container.id}`,
        value: container.id.toString()
      }))
    },
    {
      type: 'select' as const,
      fieldName: 'size_id' as const,
      label: 'Размер',
      options: sizes.map(size => ({
        label: size.name,
        value: size.id
      }))
    },
    {
      type: 'input' as const,
      fieldName: 'len_height' as const,
      label: 'Размеры',
      placeholder: '2x2,4x1,75'
    }
  ];

  return (
    <>
      {/* Панель поиска и добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
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
        enableActions={true}
        onEdit={handleEdit}
        onDelete={handleDeleteAdapter}
        tableId="cells-table"
        enableColumnReordering={true}
        persistColumnOrder={true}
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
        defaultValues={editingCell ? {
          name: editingCell.name,
          containerId: editingCell.containerId,
          size_id: editingCell.size_id,
          len_height: editingCell.len_height || ''
        } : undefined}
      />
    </>
  );
} 