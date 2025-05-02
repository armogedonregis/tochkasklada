'use client';

import { useState } from 'react';
import { useGetContainersQuery, useDeleteContainerMutation, useAddContainerMutation, useUpdateContainerMutation } from '@/services/containersApi';
import { useGetLocationsQuery } from '@/services/locationsApi';
import { useGetCellsByContainerQuery } from '@/services/cellsApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseLocationModal } from '@/components/modals/BaseLocationModal';
import { ColumnDef } from '@tanstack/react-table';
import { Container, CreateContainerDto } from '@/services/containersApi';
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

// Расширяем тип Container, добавляя свойство expanded
interface ContainerWithExpanded extends Container {
  expanded: boolean;
}

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
  const [expandedContainers, setExpandedContainers] = useState<number[]>([]);
  
  const { data: containers = [], error, isLoading } = useGetContainersQuery();
  const { data: locations = [], isLoading: isLocationsLoading } = useGetLocationsQuery();
  const [deleteContainer] = useDeleteContainerMutation();
  const [addContainer] = useAddContainerMutation();
  const [updateContainer] = useUpdateContainerMutation();

  // Функция для переключения состояния развернутости контейнера
  const toggleExpandContainer = (containerId: number) => {
    setExpandedContainers(prev => 
      prev.includes(containerId) 
        ? prev.filter(id => id !== containerId) 
        : [...prev, containerId]
    );
  };

  // Вспомогательные функции
  const getLocationInfo = (locId: string) => {
    return locations.find(location => location.id === locId);
  };

  // Определение колонок таблицы
  const columns: ColumnDef<ContainerWithExpanded>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => {
        const isExpanded = expandedContainers.includes(row.original.id);
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandContainer(row.original.id);
            }}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
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

  // Компонент для отображения расширенной информации о ячейках контейнера
  const ExpandedContainerCells = ({ containerId }: { containerId: number }) => {
    const { data: cells = [], isLoading } = useGetCellsByContainerQuery(containerId);

    if (isLoading) return <div className="p-4 pl-12">Загрузка ячеек...</div>;

    if (cells.length === 0) return (
      <div className="p-4 pl-12 text-sm text-gray-500">
        В этом контейнере нет ячеек. 
        <Button variant="link" className="p-0 h-auto text-sm" onClick={() => {
          // Здесь можно добавить логику перехода на страницу добавления ячеек
          window.location.href = `/locations/cells/add?containerId=${containerId}`;
        }}>
          Добавить ячейки
        </Button>
      </div>
    );

    return (
      <div className="pl-12 pr-4 py-4 border-t border-gray-100">
        <h4 className="text-sm font-medium mb-2">Ячейки контейнера:</h4>
        <div className="bg-gray-50 rounded-md p-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="p-2">Название</th>
                <th className="p-2">Размер</th>
                <th className="p-2">Площадь</th>
              </tr>
            </thead>
            <tbody>
              {cells.map(cell => (
                <tr key={cell.id} className="border-t border-gray-200">
                  <td className="p-2 text-gray-700">{cell.name}</td>
                  <td className="p-2 text-gray-700">{cell.size?.size || '-'}</td>
                  <td className="p-2 text-gray-700">{cell.size?.area || '-'} м²</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex justify-end">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = `/locations/cells?containerId=${containerId}`}
          >
            Управление ячейками
          </Button>
        </div>
      </div>
    );
  };

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

  // Модифицируем данные для таблицы, чтобы добавить развернутую информацию
  const tableData: ContainerWithExpanded[] = containers.map(container => ({
    ...container,
    expanded: expandedContainers.includes(container.id)
  }));

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsModalOpen(true)}>
          Добавить контейнер
        </Button>
      </div>

      {/* Таблица с кастомным рендером для поддержки разворачивания */}
      <div className="rounded-md border">
        <BaseTable
          data={tableData}
          columns={columns}
          searchColumn="id"
          searchPlaceholder="Поиск по номеру контейнера..."
          renderRowSubComponent={({ row }) => 
            expandedContainers.includes(row.original.id) ? <ExpandedContainerCells containerId={row.original.id} /> : null
          }
        />
      </div>

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