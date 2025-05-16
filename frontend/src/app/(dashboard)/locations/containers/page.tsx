'use client';

import { useState } from 'react';
import { useGetContainersQuery, useGetContainerQuery, useDeleteContainerMutation, useAddContainerMutation, useUpdateContainerMutation } from '@/services/containersApi';
import { useLazyGetLocationsQuery } from '@/services/locationsApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { Container, ContainerWithExpanded, Cell, CreateContainerDto, ContainerSortField } from '@/types/container.types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';

// Схема валидации для контейнеров (name как строка в форме, но преобразуется в число)
const containerValidationSchema = yup.object({
  name: yup.number()
    .required('Номер контейнера обязателен'),
  locId: yup.string().required('Выберите локацию')
});

export default function ContainersPage() {
  // Состояние для развернутых контейнеров
  const [expandedContainers, setExpandedContainers] = useState<string[]>([]);
  
  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<ContainerSortField>({
    defaultPageSize: 10
  });

  // Получение данных контейнеров с учетом параметров
  const { data, error, isLoading, refetch } = useGetContainersQuery(
    tableControls.queryParams
  );
  
  const containers = data?.data || [];
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 0;

  // Lazy запрос для поиска локаций
  const [getLocations, { data: locationsData = { data: [] }, isLoading: isLocationsLoading }] = useLazyGetLocationsQuery();
  
  // Мутации для операций с контейнерами
  const [deleteContainer] = useDeleteContainerMutation();
  const [addContainer] = useAddContainerMutation();
  const [updateContainer] = useUpdateContainerMutation();

  // Функция для переключения состояния развернутости контейнера
  const toggleExpandContainer = (containerId: string) => {
    setExpandedContainers(prev => 
      prev.includes(containerId) 
        ? prev.filter(id => id !== containerId) 
        : [...prev, containerId]
    );
  };

  // Находим максимальный ID для предложения следующего номера
  const getNextId = () => {
    if (containers.length === 0) return '01';
    const maxName = Math.max(...containers.map(c => c.name));
    const nextName = maxName + 1;
    return nextName < 10 ? `0${nextName}` : `${nextName}`;
  };

  // Модифицируем данные для таблицы, чтобы добавить развернутую информацию
  const tableData: ContainerWithExpanded[] = containers.map(container => ({
    ...container,
    expanded: expandedContainers.includes(container.id)
  }));

  // Хук для управления модальным окном
  const modal = useFormModal<CreateContainerDto, Container>({
    onSubmit: async (values) => {
      // Преобразуем name из строки в число для отправки на сервер
      const nameNumber = values.name;
      
      if (modal.editItem) {
        await updateContainer({ 
          id: modal.editItem.id,
          name: nameNumber,
          locId: values.locId 
        }).unwrap();
        toast.success('Контейнер успешно обновлен');
      } else {
        await addContainer({
          name: nameNumber,
          locId: values.locId
        }).unwrap();
        toast.success('Контейнер успешно добавлен');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении контейнера');
    }
  });

  // Обработчик удаления
  const handleDelete = async (container: Container) => {
    if (window.confirm('Вы уверены, что хотите удалить этот контейнер?')) {
      try {
        await deleteContainer(container.id).unwrap();
        toast.success('Контейнер успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении контейнера');
      }
    }
  };

  // Функция для поиска локаций
  const handleLocationSearch = (query: string) => {
    getLocations({
      search: query,
      limit: 10
    });
  };

  // Форматируем локации для селектора
  const locationOptions = locationsData.data.map(location => ({
    label: `${location.name} (${location.city?.short_name || 'Нет города'})`,
    value: location.id
  }));

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
      accessorKey: 'name',
      id: 'name',
      header: 'Номер',
      cell: ({ row }) => {
        const name = row.original.name;
        // Форматируем номер с лидирующим нулем если нужно
        return `${name < 10 ? `0${name}` : name}`;
      },
    },
    {
      accessorKey: 'location',
      id: 'location',
      header: 'Локация',
      cell: ({ row }) => {
        const location = row.original.location;
        return location?.short_name || 'Не указана';
      },
    },
    {
      id: 'city',
      header: 'Город',
      cell: ({ row }) => {
        const location = row.original.location;
        return location?.city?.short_name || 'Не указан';
      },
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
    },
  ];

  // Компонент для отображения расширенной информации о ячейках контейнера
  const ExpandedContainerCells = ({ containerId }: { containerId: string }) => {
    // Используем запрос для получения контейнера с ячейками
    const { data: containerWithCells, isLoading } = useGetContainerQuery(containerId);
    const containerCells = containerWithCells?.cells || [];
    
    if (isLoading) return <div className="p-4 pl-12">Загрузка ячеек...</div>;
    
    if (!containerWithCells) return <div className="p-4 pl-12">Контейнер не найден</div>;

    if (containerCells.length === 0) return (
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
              {containerCells.map((cell: Cell) => (
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

  // Поля формы для модального окна
  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'Номер контейнера',
      placeholder: 'Например: 01'
    },
    // Используем searchSelect с onSearch для поиска локаций
    {
      type: 'searchSelect' as const,
      fieldName: 'locId' as const,
      label: 'Локация',
      placeholder: 'Поиск локации...',
      options: locationOptions,
      onSearch: handleLocationSearch
    }
  ];

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={modal.openCreate}>
          Добавить контейнер
        </Button>
      </div>

      {/* Таблица с кастомным рендером для поддержки разворачивания */}
      <div className="rounded-md border">
        <BaseTable
          data={tableData}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Поиск по номеру контейнера..."
          renderRowSubComponent={({ row }) => 
            expandedContainers.includes(row.original.id) ? <ExpandedContainerCells containerId={row.original.id} /> : null
          }
          onEdit={modal.openEdit}
          onDelete={handleDelete}
          tableId="containers-table"
          totalCount={totalCount}
          pageCount={pageCount}
          onPaginationChange={tableControls.handlePaginationChange}
          onSortingChange={tableControls.handleSortingChange}
          onSearchChange={tableControls.handleSearchChange}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          sortableFields={ContainerSortField}
          pagination={tableControls.pagination}
          sorting={tableControls.sorting}
          persistSettings={true}
        />
      </div>

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать контейнер' : 'Добавить контейнер'}
        fields={modalFields}
        validationSchema={containerValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          name: modal.editItem.name < 10 ? `0${modal.editItem.name}` : `${modal.editItem.name}`,
          locId: modal.editItem.locId || ''
        } : {
          name: getNextId(),
          locId: ''
        }}
      />
    </>
  );
} 