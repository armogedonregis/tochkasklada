"use client";

import { useState } from 'react';
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
import { Search, Plus } from "lucide-react";
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { useTableControls } from '@/hooks/useTableControls';
import { useGetCellStatusesQuery } from '@/services/cellStatusesService/cellStatusesApi';
import { useLazyGetClientsQuery } from '@/services/clientsService/clientsApi';
import { useLazyGetAdminCellsQuery } from '@/services/cellService/cellsApi';
import { differenceInDays } from 'date-fns/differenceInDays';

// Схема валидации для аренды ячейки
const cellRentalValidationSchema = yup.object({
  cellId: yup.string().required('ID ячейки обязательно'),
  clientId: yup.string().required('ID клиента обязательно'),
  startDate: yup.date(),
  endDate: yup.date(),
  statusType: yup.string(),
});

// Названия статусов
const statusTitles: Record<CellRentalStatus, string> = {
  [CellRentalStatus.ACTIVE]: 'Активная',
  [CellRentalStatus.EXPIRING_SOON]: 'Скоро истекает',
  [CellRentalStatus.EXPIRED]: 'Просрочена',
  [CellRentalStatus.CLOSED]: 'Закрыта',
  [CellRentalStatus.RESERVATION]: 'Бронь',
  [CellRentalStatus.EXTENDED]: 'Продлена',
  [CellRentalStatus.PAYMENT_SOON]: 'Скоро оплата'
};

export default function CellRentalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CellRentalStatusType>('ALL');

  const tableControls = useTableControls<CellRentalSortField>({
    defaultPageSize: 10,
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search)
    tableControls.handleSearchChange(search)
  };


  const [getCells, { data: cellsData = { data: [] } }] = useLazyGetAdminCellsQuery();
  const [getClients, { data: clientsData = { data: [] } }] = useLazyGetClientsQuery()


  // Функция для поиска ячеек
  const handleCellsSearch = (query: string) => {
    getCells({
      search: query,
      limit: 20
    });
  };

  // Функция для поиска клиентов
  const handleClientsSearch = (query: string) => {
    getClients({
      search: query,
      limit: 20
    });
  };


  // Получение данных об арендах
  const { data, error, isLoading, refetch } = useGetCellRentalsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    search: tableControls.queryParams.search,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection,
    rentalStatus: statusFilter === 'ALL' ? undefined : statusFilter
  });


  const { data: statusList } = useGetCellStatusesQuery();

  // Данные аренд
  const cellRentals = data?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('ru-RU')}`;
  };

  // Мутации для операций с арендами
  const [createCellRental] = useCreateCellRentalMutation();
  const [updateCellRental] = useUpdateCellRentalMutation();
  const [deleteCellRental] = useDeleteCellRentalMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<CreateCellRentalDto, CellRental>({
    onSubmit: async (values) => {
      if (modal.editItem) {
        await updateCellRental({
          id: modal.editItem.id,
          ...values
        }).unwrap();
        toast.success('Аренда ячейки успешно обновлена');
      } else {
        await createCellRental(values).unwrap();
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
  const modalFields = [
    {
      type: 'searchSelect' as const,
      fieldName: 'cellId' as const,
      label: 'Ячейка',
      placeholder: 'Введите ID ячейки',
      onSearch: handleCellsSearch,
      options: cellsData?.data.map((cell) => ({
        label: cell.container?.location?.short_name + '-' + cell.name,
        value: cell.id
      }))
    },
    {
      type: 'searchSelect' as const,
      fieldName: 'clientId' as const,
      label: 'Клиент',
      placeholder: 'Выберите клиента',
      onSearch: handleClientsSearch,
      options: clientsData?.data.map((client) => ({
        label: `${client.name} (${client.user?.email || 'Нет email'})`,
        value: client.id
      }))
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
      type: 'select' as const,
      fieldName: 'rentalStatus' as const,
      label: 'Статус аренды',
      placeholder: 'Выберите статус',
      options: [
        { value: 'ALL', label: 'Все статусы' },
        ...Object.entries(statusTitles).map(([value, label]) => ({
          value,
          label
        }))
      ]
    }
  ];


  // Определение колонок таблицы
  const columns: ColumnDef<CellRental>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'cell',
      header: 'Номер ячейки',
      cell: ({ row }) => (
        <div className="font-mono text-base truncate max-w-[140px]" title={row.original?.cell?.name}>
          {row.original?.cell?.name}
        </div>
      ),
    },
    {
      accessorKey: 'rentalStatus',
      header: 'Статус',
      cell: ({ row }) => {
        const statusColor = statusList?.find(item => item.statusType === row.original.rentalStatus)?.color;
        const statusText = statusTitles[row.original.rentalStatus];
        return (
          <div
            style={{
              backgroundColor: statusColor,
              padding: '4px 12px',
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px',
              maxWidth: '140px'
            }}
            title={row.original?.cell?.name}
          >
            <span
              style={{
                color: 'white',
                textShadow: '0 0 3px black, 0 0 5px black',
                fontWeight: 600,
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              {statusText}
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
      header: 'Размер ячейки',
      cell: ({ row }) => (
        <div className="font-mono text-base truncate max-w-[140px]" title={row.original?.cell?.size?.short_name}>
          {row.original?.cell?.size?.short_name}
        </div>
      ),
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
  ];


  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-4">
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
            {Object.entries(statusTitles).map(([status, title]) => (
              <SelectItem key={status} value={status}>
                {title}
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
        defaultValues={modal.editItem ? {
          cellId: modal.editItem.cellId,
          clientId: modal.editItem.clientId,
          startDate: formatDateForInput(modal.editItem.startDate),
          endDate: formatDateForInput(modal.editItem.endDate),
          rentalStatus: modal.editItem.rentalStatus
        } : {
          cellId: '',
          clientId: '',
          startDate: '',
          endDate: '',
          rentalStatus: 'ACTIVE'
        }}
      />
    </div>
  );
}