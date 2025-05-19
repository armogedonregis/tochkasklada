'use client';

import { useState } from 'react';
import { useGetContainersQuery, useGetContainerQuery, useDeleteContainerMutation, useAddContainerMutation, useUpdateContainerMutation } from '@/services/containersService/containersApi';
import { useLazyGetLocationsQuery } from '@/services/locationsService/locationsApi';
import { useGetSizesQuery } from '@/services/sizesService/sizesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Container, ContainerWithExpanded, Cell, ContainerSortField } from '@/services/containersService/container.types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTableControls } from '@/hooks/useTableControls';

// Массив букв для ячеек
const cellLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function ContainersPage() {
  // Состояние для развернутых контейнеров
  const [expandedContainers, setExpandedContainers] = useState<string[]>([]);
  
  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Container | null>(null);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    locId: '',
    cells: {} as Record<string, { checked: boolean, sizeId: string }>
  });
  
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
  const [getLocations, { data: locationsData = { data: [] }}] = useLazyGetLocationsQuery();
  
  // Мутации для операций с контейнерами
  const [deleteContainer] = useDeleteContainerMutation();
  const [addContainer] = useAddContainerMutation();
  const [updateContainer] = useUpdateContainerMutation();

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

  // Обработчик изменения ввода
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик изменения чекбокса ячейки
  const handleCellCheckChange = (letter: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cells: {
        ...prev.cells,
        [letter]: {
          checked,
          sizeId: prev.cells[letter]?.sizeId || defaultSizeId
        }
      }
    }));
  };

  // Обработчик изменения размера ячейки
  const handleCellSizeChange = (letter: string, sizeId: string) => {
    setFormData(prev => ({
      ...prev,
      cells: {
        ...prev.cells,
        [letter]: {
          ...prev.cells[letter],
          sizeId
        }
      }
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем обязательные поля
    if (!formData.name.trim()) {
      toast.error('Введите номер контейнера');
      return;
    }
    
    if (!formData.locId) {
      toast.error('Выберите локацию');
      return;
    }
    
    // Подготавливаем массив ячеек
    const cells = Object.entries(formData.cells)
      .filter(([_, data]) => data.checked)
      .map(([letter, data]) => ({
        name: letter,
        size_id: data.sizeId
      }));
    
    try {
      if (editItem) {
        // При редактировании просто обновляем основные данные контейнера
        await updateContainer({ 
          id: editItem.id,
          name: formData.name,
          locId: formData.locId 
        }).unwrap();
        toast.success('Контейнер успешно обновлен');
      } else {
        // При создании добавляем ячейки, если они указаны
        await addContainer({
          name: formData.name,
          locId: formData.locId,
          cells: cells.length > 0 ? cells : undefined
        }).unwrap();
        toast.success('Контейнер успешно добавлен');
      }
      closeModal();
    } catch (error) {
      toast.error('Ошибка при сохранении контейнера');
    }
  };

  // Функции для управления модальным окном
  const openCreateModal = () => {
    // Инициализируем пустую форму с дефолтным номером
    const initialCells = {} as Record<string, { checked: boolean, sizeId: string }>;
    cellLetters.forEach(letter => {
      initialCells[letter] = { checked: false, sizeId: defaultSizeId };
    });
    
    setFormData({
      name: getNextId(),
      locId: '',
      cells: initialCells
    });
    
    setEditItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (container: Container) => {
    // Инициализируем форму данными из контейнера
    const initialCells = {} as Record<string, { checked: boolean, sizeId: string }>;
    cellLetters.forEach(letter => {
      initialCells[letter] = { checked: false, sizeId: defaultSizeId };
    });
    
    setFormData({
      name: container.name < 10 ? `0${container.name}` : `${container.name}`,
      locId: container.locId || '',
      cells: initialCells
    });
    
    setEditItem(container);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

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
  const handleLocationSearch = () => {
    getLocations({
      search: '',
      limit: 20
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

  // Компонент для отображения чекбокса с селектором
  const CellCheckboxWithSelect = ({ letter }: { letter: string }) => {
    const cellData = formData.cells[letter] || { checked: false, sizeId: defaultSizeId };
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-row items-center space-x-1">
          <Checkbox
            id={`cell-${letter}`}
            checked={cellData.checked}
            onCheckedChange={(checked) => handleCellCheckChange(letter, !!checked)}
            className="w-3.5 h-3.5"
          />
          <Label htmlFor={`cell-${letter}`} className="text-xs font-medium cursor-pointer">
            Ячейка {letter}
          </Label>
        </div>

        <div className={`flex-1 transition-opacity ${cellData.checked ? 'opacity-100' : 'opacity-50'}`}>
          <Select
            value={cellData.sizeId}
            onValueChange={(value) => handleCellSizeChange(letter, value)}
            disabled={!cellData.checked}
          >
            <SelectTrigger className="h-7 text-xs min-h-0 py-0">
              <SelectValue placeholder="Размер" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map(option => (
                <SelectItem 
                  key={option.value.toString()} 
                  value={option.value.toString()}
                  className="text-xs py-1"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={openCreateModal}>
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
          onEdit={openEditModal}
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
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) closeModal();
      }}>
        <DialogContent 
          className="p-0 sm:max-w-[600px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg">
            <DialogHeader className="mb-4 relative">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {editItem ? 'Редактировать контейнер' : 'Добавить контейнер с ячейками'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Поле для номера контейнера */}
                <div className="space-y-2">
                  <Label htmlFor="name">Номер контейнера</Label>
                  <Input 
                    id="name"
                    placeholder="Например: 01" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                {/* Поле для локации */}
                <div className="space-y-2">
                  <Label htmlFor="location">Локация</Label>
                  <Select
                    value={formData.locId}
                    onValueChange={(value) => handleInputChange('locId', value)}
                    onOpenChange={() => {
                      // При открытии загружаем локации если их нет
                      if (locationOptions.length === 0) {
                        handleLocationSearch();
                      }
                    }}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Выберите локацию" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map(option => (
                        <SelectItem key={option.value.toString()} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Заголовок для ячеек */}
                <div>
                  <h3 className="font-medium text-base mb-2">Ячейки контейнера</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cellLetters.map(letter => (
                      <CellCheckboxWithSelect key={letter} letter={letter} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Кнопки */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="h-11 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  variant="outline"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#F62D40] to-[#F8888F] rounded-md hover:from-[#E11830] hover:to-[#E76A73] disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  {editItem ? 'Сохранить' : 'Добавить'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 