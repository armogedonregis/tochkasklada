"use client";

import { useState, useMemo } from 'react';
import {
  useGetCellRentalsQuery,
  useCreateCellRentalMutation,
  useUpdateCellRentalMutation,
  useDeleteCellRentalMutation
} from '@/services/cellRentalsService/cellRentalsApi';
import { Button } from '@/components/ui/button';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { CellRental, CellRentalSortField, CellRentalStatus, CellRentalStatusType, CreateCellRentalDto, UpdateCellRentalDto } from '@/services/cellRentalsService/cellRentals.types';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormModal } from '@/hooks/useFormModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronDown, ChevronRight, User, Eye } from "lucide-react";
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { useTableControls } from '@/hooks/useTableControls';
import { useGetCellStatusesQuery } from '@/services/cellStatusesService/cellStatusesApi';
import { useLazyGetClientsQuery } from '@/services/clientsService/clientsApi';
import { useLazyGetAdminCellsQuery } from '@/services/cellService/cellsApi';
import { useGetLocationsQuery } from '@/services/locationsService/locationsApi';
import { differenceInDays, addDays } from 'date-fns';
import { useRouter } from 'next/navigation';

// Схема валидации для аренды ячейки (множественный выбор ячеек)
const cellRentalValidationSchema = yup.object({
  cellIds: yup.array().of(yup.string()).min(1, 'Выберите хотя бы одну ячейку'),
  clientId: yup.string().required('ID клиента обязательно'),
  startDate: yup.date(),
  endDate: yup.date(),
  days: yup.number().min(1, 'Минимум 1 день').optional(),
  statusType: yup.string(),
});

export default function CellRentalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CellRentalStatusType>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  const tableControls = useTableControls<CellRentalSortField>({
    defaultPageSize: 10,
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search)
    tableControls.handleSearchChange(search)
  };


  const [getCells] = useLazyGetAdminCellsQuery();
  const [getClients] = useLazyGetClientsQuery()

  // Получение локаций для фильтра
  const { data: locationsData = { data: [] } } = useGetLocationsQuery();

  // Получение данных об арендах
  const { data, error, isLoading, refetch } = useGetCellRentalsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    search: tableControls.queryParams.search,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection,
    rentalStatus: statusFilter === 'ALL' ? undefined : statusFilter,
    locationId: locationFilter === 'ALL' ? undefined : locationFilter
  });


  const { data: statusList } = useGetCellStatusesQuery();

  // Данные аренд
  const cellRentals = data?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const utcMidnight = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    return new Intl.DateTimeFormat('ru-RU').format(utcMidnight);
  };

  const router = useRouter();

  // Мутации для операций с арендами
  const [createCellRental] = useCreateCellRentalMutation();
  const [updateCellRental] = useUpdateCellRentalMutation();
  const [deleteCellRental] = useDeleteCellRentalMutation();

  // Хук для управления модальным окном
  type RentalFormValues = CreateCellRentalDto & { days?: number };

  const modal = useFormModal<RentalFormValues, CellRental>({
    onSubmit: async (values) => {
      const { days, startDate, endDate: initialEnd, ...dto } = values as any;
      console.log(startDate, days)

      let computedEnd = initialEnd;
      if (days && startDate && !computedEnd) {
        // Создаем дату в UTC без сдвига часового пояса
        const [year, month, day] = startDate.split('-').map(Number);
        const startUtc = new Date(Date.UTC(year, month - 1, day)); // month - 1 потому что в JS месяцы начинаются с 0
        const dateEnd = addDays(startUtc, Number(days));
        computedEnd = dateEnd.toISOString().split('T')[0];
      }

      const payload: CreateCellRentalDto | UpdateCellRentalDto = {
        ...dto,
        // Если выбраны несколько ячеек, используем их; иначе для обратной совместимости упакуем одиночный cellId
        cellIds: dto?.cellIds?.length ? dto.cellIds : (dto?.cellId ? [dto.cellId] : undefined),
        cellId: undefined,
        // Правильно форматируем даты, извлекая компоненты из объекта Date
        startDate: startDate ? (startDate instanceof Date ? 
          `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}T00:00:00.000Z` : 
          `${startDate}T00:00:00.000Z`) : undefined,
        endDate: computedEnd ? (computedEnd instanceof Date ? 
          `${computedEnd.getFullYear()}-${String(computedEnd.getMonth() + 1).padStart(2, '0')}-${String(computedEnd.getDate()).padStart(2, '0')}T00:00:00.000Z` : 
          `${computedEnd}T00:00:00.000Z`) : undefined,
      } as any;

      if (modal.editItem) {
        await updateCellRental({
          id: modal.editItem.id,
          ...(payload as any)
        } as any).unwrap();
        toast.success('Аренда ячейки успешно обновлена');
      } else {
        await createCellRental(payload as any).unwrap();
        toast.success('Аренда ячейки успешно создана');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении аренды ячейки');
    }
  });

  // Обработчик удаления
  const handleDelete = async (rental: CellRental) => {
    if (window.confirm('Вы уверены, что хотите удалить эту аренду ячейки?')) {
      try {
        await deleteCellRental(rental.id).unwrap();
        toast.success('Аренда ячейки успешно удалена');
      } catch (error) {
        toast.error('Ошибка при удалении аренды ячейки');
      }
    }
  };

  // Поля формы для модального окна
  const preselectedCellOptions = useMemo(() => {
    if (!modal.editItem) return [] as { label: string; value: string }[];
    const cells = (modal.editItem as any)?.cell;
    if (Array.isArray(cells) && cells.length) {
      return cells.map((cell: any) => ({
        label: cell?.container?.location?.short_name ? `${cell.container.location.short_name}-${cell.name}` : cell?.name,
        value: cell?.id,
      }));
    }
    if ((modal.editItem as any)?.cellId) {
      const id = (modal.editItem as any).cellId as string;
      return [{ label: `Ячейка ${id}`, value: id }];
    }
    return [] as { label: string; value: string }[];
  }, [modal.editItem]);

  const preselectedClientOption = useMemo(() => {
    if (!modal.editItem) return null as null | { label: string; value: string };
    const client = (modal.editItem as any)?.client;
    if (client) {
      return { label: `${client.name} (${client.user?.email || 'Нет email'})`, value: client.id };
    }
    if ((modal.editItem as any)?.clientId) {
      const id = (modal.editItem as any).clientId as string;
      return { label: `Клиент ${id}`, value: id };
    }
    return null;
  }, [modal.editItem]);

  const modalFields = [
    {
      type: 'searchSelect' as const,
      fieldName: 'cellIds' as const,
      label: 'Ячейки',
      placeholder: 'Выберите ячейки',
      isMulti: true,
      onSearch: async (q: string) => {
        const res = await getCells({ search: q, limit: 20 }).unwrap();
        return res.data.map(c => ({
          label: c.container?.location?.short_name ? `${c.container.location.short_name}-${c.name}` : c.name,
          value: c.id,
        }));
      },
      options: preselectedCellOptions
    },
    {
      type: 'searchSelect' as const,
      fieldName: 'clientId' as const,
      label: 'Клиент',
      placeholder: 'Выберите клиента',
      onSearch: async (q: string) => {
        const res = await getClients({ search: q, limit: 20 }).unwrap();
        return res.data.map(c => ({
          label: `${c.name} (${c.user?.email || 'Нет email'})`,
          value: c.userId
        }));
      },
      options: preselectedClientOption ? [preselectedClientOption] : []
    },
    {
      type: 'input' as const,
      inputType: 'date' as const,
      fieldName: 'startDate' as const,
      label: 'Дата начала',
      placeholder: 'Выберите дату начала'
    },
    {
      type: 'input' as const,
      inputType: 'date' as const,
      fieldName: 'endDate' as const,
      label: 'Дата окончания',
      placeholder: 'Выберите дату окончания'
    },
    {
      type: 'input' as const,
      inputType: 'number',
      fieldName: 'days' as const,
      label: 'Дней аренды',
      placeholder: 'Введите количество дней',
      onChange: (form: any, value: string) => {
        const days = parseInt(value, 10);
        const start = form.getValues('startDate');
        if (start && !isNaN(days)) {
          // Создаем дату в UTC без сдвига часового пояса
          const [year, month, day] = start.split('-').map(Number);
          const startUtc = new Date(Date.UTC(year, month - 1, day)); // month - 1 потому что в JS месяцы начинаются с 0
          // Для 1 дня: startDate = сегодня, endDate = завтра (добавляем 1 день)
          const dateEnd = addDays(startUtc, days);
          const endString = dateEnd.toISOString().split('T')[0];
          form.setValue('endDate', endString, { shouldValidate: true });
          form.trigger('endDate');
        }
      }
    },
    {
      type: 'select' as const,
      fieldName: 'rentalStatus' as const,
      label: 'Статус аренды',
      placeholder: 'Выберите статус',
      options: statusList ? statusList.map(status => ({
        label: status.name,
        value: status.statusType as string
      })) : []
    }
  ];

  const [expandedRentals, setExpandedRentals] = useState<string[]>([]);

  const toggleExpandRental = (rentalId: string) => {
    setExpandedRentals(prev =>
      prev.includes(rentalId)
        ? prev.filter(id => id !== rentalId)
        : [...prev, rentalId]
    );
  };

  const ExpandedRentalInfo = ({ rental }: { rental: CellRental }) => {
    const client = rental?.client;

    if (!client) {
      return (
        <div className="p-4 pl-12 text-sm text-gray-500">Информация о клиенте недоступна</div>
      );
    }

    return (
      <div className="pl-12 pr-4 py-4 border-t border-gray-100">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <User size={16} />
            Информация о клиенте
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">ФИО:</p>
              <p className="font-medium">{client?.name}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email:</p>
              <p className="font-medium">{client?.user?.email || 'Не указан'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 dark:text-gray-400 mb-1">Телефоны:</p>
              <div className="font-medium space-y-1">
                {client.phones && client.phones.length > 0 ? (
                  client.phones.map((phone: any, index: number) => (
                    <div key={index} className="bg-white dark:bg-gray-700 px-3 py-1 rounded">
                      {typeof phone === 'object' ? phone.phone || phone.number : phone}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Телефоны не указаны</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Определение колонок таблицы
  const columns: ColumnDef<CellRental>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => {
        const isExpanded = expandedRentals.includes(row.original.id);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandRental(row.original.id);
            }}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'cell',
      header: 'Ячейки',
      cell: ({ row }) => {
        const cells = row.original?.cell;
        if (!cells) return '-';

        // Если cell является массивом, показываем все ячейки
        if (Array.isArray(cells)) {
          const cellNames = cells.map(c => c.name).join(', ');
          return (
            <div className="font-mono text-base truncate max-w-[140px]" title={cellNames}>
              {cellNames}
            </div>
          );
        }
      },
    },
    {
      accessorKey: 'rentalStatus',
      header: 'Статус',
      cell: ({ row }) => {
        const currentStatus = statusList?.find(item => item.statusType === row.original.rentalStatus);
        return (
          <div
            style={{
              backgroundColor: currentStatus?.color || '#gray',
              padding: '4px 12px',
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px',
              maxWidth: '140px'
            }}
            title={row.original?.cell?.map(c => c.name).join(', ')}
          >
            <span
              style={{
                color: currentStatus?.color === '#ffffff' ? '#000000' : '#ffffff',
                textShadow: currentStatus?.color === '#ffffff' ? 'none' : '0 0 3px black, 0 0 5px black',
                fontWeight: 600,
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              {currentStatus?.name || 'Неизвестный статус'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'allday',
      header: 'Дней аренды',
      cell: ({ row }) => {
        const { startDate, endDate } = row.original || {};
        if (!startDate || !endDate) return '-';

        try {
          return differenceInDays(new Date(endDate), new Date(startDate));
        } catch {
          return '-';
        }
      }
    },
    {
      accessorKey: 'cell.size',
      header: 'Размеры ячеек',
      cell: ({ row }) => {
        const cells = row.original?.cell;
        if (!cells) return '-';

        if (Array.isArray(cells)) {
          const uniqueSizes = [...new Set(cells.map(c => c.size?.short_name).filter(Boolean))];
          const sizesText = uniqueSizes.join(', ');
          return (
            <div className="font-mono text-base truncate max-w-[140px]" title={sizesText}>
              {sizesText}
            </div>
          );
        }
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Начало аренды',
      cell: ({ row }) => {
        return <div>{formatDate(row.original.startDate)}</div>;
      }
    },
    {
      accessorKey: 'endDate',
      header: 'Окончание аренды',
      cell: ({ row }) => {
        return <div>{formatDate(row.original.endDate)}</div>;
      }
    },
    {
      id: 'details-link',
      header: 'Детали',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="icon"
          title="Подробнее об аренде"
          onClick={() => router.push(`/cell-rentals/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
    }
  ];


  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 10);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <div>
          <h1 className="text-2xl font-bold">Управление ячейками</h1>
          <p className="text-sm text-muted-foreground">
            Просмотр и управление арендами ячеек
          </p>
        </div>
        <Button onClick={() => modal.openCreate()} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить аренду
        </Button>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 px-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по ячейке или клиенту..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CellRentalStatus | 'ALL')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все статусы</SelectItem>
            {statusList?.map((status) => (
              <SelectItem key={status.statusType} value={status.statusType as string}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={(value) => setLocationFilter(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Фильтр по локации" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все локации</SelectItem>
            {locationsData?.data?.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name} ({location.city?.short_name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Таблица */}
      <BaseTable
        data={cellRentals}
        columns={columns}
        onEdit={modal.openEdit}
        onDelete={handleDelete}
        editPermission="rentals:update"
        deletePermission="rentals:delete"
        tableId="payments-table"
        totalCount={totalCount}
        pageCount={pageCount}
        onPaginationChange={tableControls.handlePaginationChange}
        onSortingChange={tableControls.handleSortingChange}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        sortableFields={CellRentalSortField}
        pagination={tableControls.pagination}
        sorting={tableControls.sorting}
        persistSettings={true}
        renderRowSubComponent={({ row }) =>
          expandedRentals.includes(row.original.id) ? <ExpandedRentalInfo rental={row.original} /> : null
        }
      />

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать аренду ячейки' : 'Добавить аренду ячейки'}
        fields={modalFields}
        validationSchema={cellRentalValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? (() => {
          const cells = modal.editItem?.cell;
          const cellIds = Array.isArray(cells) && cells.length ? cells.map((c) => c.id) : [];
          return {
            cellIds: cellIds,
            clientId: modal.editItem.clientId,
            startDate: formatDateForInput(modal.editItem.startDate),
            endDate: formatDateForInput(modal.editItem.endDate),
            rentalStatus: modal.editItem.rentalStatus,
            days: differenceInDays(new Date(modal.editItem.endDate), new Date(modal.editItem.startDate))
          };
        })() : {
          cellIds: [],
          clientId: undefined,
          startDate: '',
          endDate: '',
          rentalStatus: 'ACTIVE',
          days: undefined
        }}
      />
    </div>
  );
}