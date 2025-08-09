'use client';

import { useState, MouseEvent } from 'react';
import { useGetContainersQuery, useGetContainerQuery, useDeleteContainerMutation, useAddContainerMutation, useUpdateContainerMutation, useLazyGetContainerQuery } from '@/services/containersService/containersApi';
import { useLazyGetLocationsQuery } from '@/services/locationsService/locationsApi';
import { useGetSizesQuery } from '@/services/sizesService/sizesApi';
import { Container, ContainerWithExpanded, Cell, ContainerSortField } from '@/services/containersService/container.types';
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
import { ChevronDown, ChevronRight } from 'lucide-react';

// Массив букв для ячеек
const cellLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Схема валидации для контейнеров
const containerValidationSchema = yup.object({
  name: yup.string().required('Номер контейнера обязателен'),
  locId: yup.string().required('Выберите локацию')
  // Для ячеек валидация не требуется, они опциональны
});

// Тип для формы контейнера
interface ContainerFormData {
  name: string;
  locId: string;
  cells?: Array<{ name: string; size_id: string }>;
  [key: string]: any; // Для динамических полей ячеек
}

export default function ContainersPage() {
  // ====== ХУКИ ДЛЯ ДАННЫХ И ТАБЛИЦЫ ======
  const tableControls = useTableControls<ContainerSortField>({
    defaultPageSize: 10
  });

  const { data, error, isLoading, refetch } = useGetContainersQuery(
    tableControls.queryParams
  );
  
  const containers = data?.data || [];
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 0;

  // Состояние для развернутых контейнеров
  const [expandedContainers, setExpandedContainers] = useState<string[]>([]);

  // Состояние для развернутых контейнеров

  // Lazy запрос для поиска локаций
  const [getLocations] = useLazyGetLocationsQuery();

  // Lazy запрос для редактирования контейнера
  const [getContainer] = useLazyGetContainerQuery();
  
  // Получаем список размеров для ячеек
  const { data: sizesData } = useGetSizesQuery();
  const sizes = sizesData || [];
  
  // Форматируем размеры для селектора
  const sizeOptions = sizes.map(size => ({
    label: `${size.name} (${size.size}, ${size.area})`,
    value: size.id
  }));
  
  // Получаем ID первого размера для установки по умолчанию
  const defaultSizeId = sizeOptions.length > 0 ? sizeOptions[0].value.toString() : '';

  // Мутации для операций с контейнерами
  const [deleteContainer, { isLoading: isDeleting }] = useDeleteContainerMutation();
  const [addContainer, { isLoading: isAdding }] = useAddContainerMutation();
  const [updateContainer, { isLoading: isUpdating }] = useUpdateContainerMutation();

  // ====== ХУКИ ДЛЯ МОДАЛЬНЫХ ОКОН ======
  const deleteModal = useDeleteModal();

  const modal = useFormModal<ContainerFormData, Container>({
    // Функция преобразования контейнера в формат формы
    itemToFormData: (container) => initFormDataWithCells(container),
    onSubmit: async (values) => {
      try {
        // Получаем массив ячеек из формы
        const cells = getCellsFromForm(values);

        // Преобразуем номер контейнера из строки в число
        const containerNumber = parseInt(values.name);
        
        if (modal.editItem) {
          await updateContainer({ 
            id: modal.editItem.id,
            name: containerNumber.toString(),
            locId: values.locId,
            cells: cells.length > 0 ? cells : undefined
          }).unwrap();
          ToastService.success('Контейнер успешно обновлен');
        } else {
          await addContainer({
            name: containerNumber.toString(),
            locId: values.locId,
            cells: cells.length > 0 ? cells : undefined
          }).unwrap();
          ToastService.success('Контейнер успешно добавлен');
        }
      } catch (error) {
        ToastService.error('Ошибка при сохранении контейнера');
      }
    }
  });

  // Функция для инициализации данных формы с добавлением ячеек
  const initFormDataWithCells = (container?: Container) => {
    const formData: Record<string, any> = {};
    
    // Данные контейнера
    if (container) {
      formData.name = container.name < 10 ? `0${container.name}` : `${container.name}`;
      formData.locId = container.locId || '';
    }
    
    // Инициализируем поля для ячеек
    cellLetters.forEach(letter => {
      const cellKey = `cell_checked_${letter}`;
      const sizeKey = `cell_size_${letter}`;
      
      // Проверяем, есть ли такая ячейка у контейнера
      if (container?.cells) {
        const cellNameStr = container.name.toString() + letter;
        const existingCell = container.cells.find(cell => cell.name.toString() === cellNameStr);
        
        // Устанавливаем значение чекбокса
        formData[cellKey] = !!existingCell;
        
        // Устанавливаем размер ячейки если она существует, иначе дефолтный размер
        formData[sizeKey] = existingCell 
          ? sizes.find(s => 
              s.short_name === existingCell.size?.short_name && 
              s.size === existingCell.size?.size && 
              s.area === existingCell.size?.area
            )?.id || defaultSizeId
          : defaultSizeId;
      } else {
        // Устанавливаем дефолтные значения для новой ячейки
        formData[cellKey] = false;
        formData[sizeKey] = defaultSizeId;
      }
    });
    
    return formData;
  };

  // ====== ОБРАБОТЧИКИ СОБЫТИЙ ======
  const handleDelete = async () => {
    if (!deleteModal.entityId) return;
    
    deleteModal.setLoading(true);
    try {
      await deleteContainer(deleteModal.entityId).unwrap();
      ToastService.success('Контейнер успешно удален');
      deleteModal.resetModal();
    } catch (error) {
      ToastService.error('Ошибка при удалении контейнера');
    } finally {
      deleteModal.setLoading(false);
    }
  };

  const openDeleteModal = (container: Container) => {
    deleteModal.openDelete(container.id, `Контейнер ${container.name < 10 ? `0${container.name}` : container.name}`);
  };

  const handleCreateClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Находим максимальный ID для предложения следующего номера
    const nextId = getNextId();
    
    // Открываем форму с инициализированными полями
    const initialFormData = initFormDataWithCells();
    initialFormData.name = nextId;
    
    modal.openCreate(initialFormData);
  };

  // Находим максимальный ID для предложения следующего номера
  const getNextId = () => {
    if (containers.length === 0) return '01';
    const maxName = Math.max(...containers.map(c => c.name));
    const nextName = maxName + 1;
    return nextName < 10 ? `0${nextName}` : `${nextName}`;
  };

  // Функция для переключения состояния развернутости контейнера
  const toggleExpandContainer = (containerId: string) => {
    setExpandedContainers(prev => 
      prev.includes(containerId) 
        ? prev.filter(id => id !== containerId) 
        : [...prev, containerId]
    );
  };

  // Получаем данные ячеек из формы для отправки на сервер
  const getCellsFromForm = (formValues: any) => {
    // Получаем номер контейнера и форматируем его
    const containerNumber = parseInt(formValues.name);
    // Форматируем номер с лидирующим нулем если нужно
    const containerName = containerNumber < 10 ? `0${containerNumber}` : `${containerNumber}`;

    return Object.keys(formValues)
      .filter(key => key.startsWith('cell_checked_') && formValues[key] === true)
      .map(key => {
        const letter = key.replace('cell_checked_', '');
        const sizeIdKey = `cell_size_${letter}`;
        return {
          name: `${containerName}${letter}`,
          size_id: formValues[sizeIdKey]
        };
      });
  };

  // Модифицируем данные для таблицы, чтобы добавить развернутую информацию
  const tableData: ContainerWithExpanded[] = containers.map(container => ({
    ...container,
    expanded: expandedContainers.includes(container.id)
  }));

  // ====== ОПРЕДЕЛЕНИЯ UI КОМПОНЕНТОВ ======

  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'Номер контейнера',
      placeholder: 'Например: 01',
      defaultValue: '01'
    },
    {
      type: 'searchSelect' as const,
      fieldName: 'locId' as const,
      label: 'Локация',
      placeholder: 'Выберите локацию',
      onSearch: async (q: string) => {
        const res = await getLocations({ search: q, limit: 20 }).unwrap();
        return res.data.map(c => ({
          label: c.short_name ? `${c.short_name}` : c.name,
          value: c.id,
        }));
      },
    },
    {
      type: 'title' as const,
      label: 'Ячейки контейнера'
    },
    // Добавляем поля для каждой ячейки
    ...cellLetters.map(letter => ({
      type: 'checkboxWithSelect' as const,
      fieldName: `cell_checked_${letter}` as const,
      label: `Ячейка ${letter}`,
      checkboxLabel: `Ячейка ${letter}`,
      selectField: `cell_size_${letter}` as const,
      options: sizeOptions
    }))
  ];

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
    }
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
        <Button variant="link" className="p-0 h-auto text-sm" onClick={() => modal.openEdit(containerWithCells)}>
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
                <th className="p-2">Тип ячейки</th>
                <th className="p-2">Размер/Площадь</th>
              </tr>
            </thead>
            <tbody>
              {containerCells.map((cell: Cell) => (
                <tr key={cell.id} className="border-t border-gray-200">
                  <td className="p-2 text-gray-700">{cell.name}</td>
                  <td className="p-2 text-gray-700">{cell.size?.short_name || '-'}</td>
                  <td className="p-2 text-gray-700">{cell.size?.area + " / " + cell.size?.size || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ====== РЕНДЕР СТРАНИЦЫ ======
  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={handleCreateClick}>
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
          onDelete={openDeleteModal}
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

      {/* Модальное окно формы для контейнера и ячеек */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать контейнер' : 'Добавить контейнер'}
        fields={modalFields}
        validationSchema={containerValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        formData={modal.formData}
        isLoading={isAdding || isUpdating}
        className="sm:max-w-[640px]"
        isCheckBoxWithSelectMulty={true}
        defaultValues={modal.editItem 
          ? initFormDataWithCells(modal.editItem)
          : initFormDataWithCells()}
      />

      {/* Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        entityName={deleteModal.entityName || 'контейнер'}
        isLoading={isDeleting || deleteModal.isLoading}
      />
    </>
  );
} 