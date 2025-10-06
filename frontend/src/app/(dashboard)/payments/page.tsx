'use client';

import { useState, useMemo } from 'react';
import {
  useGetAllPaymentsQuery,
  useAdminCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} from '@/services/paymentsService/paymentsApi';
import { useLazyGetClientsQuery } from '@/services/clientsService/clientsApi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronRight, User, Check, X } from 'lucide-react';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';
import * as yup from 'yup';
import { Payment, PaymentSortField } from '@/services/paymentsService/payments.types';
import { SortDirection } from '@/services/services.types';
import { useLazyGetAdminCellsQuery } from '@/services/cellService/cellsApi';
import { Cell } from '@/services/cellService/cell.types';

// Функция для создания схемы валидации (userId обязателен только при создании)
const getPaymentValidationSchema = (isEdit: boolean) => yup.object({
  userId: isEdit ? yup.string().optional() : yup.string().required('Клиент обязателен'),
  amount: yup.number().required('Сумма обязательна').min(1, 'Сумма должна быть больше 0'),
  description: yup.string().optional(),
  cellId: yup.string().optional(),
  cellIds: yup.array().of(yup.string()).optional(),
  rentalDuration: yup.number().optional().min(1, 'Срок аренды должен быть > 0').nullable(),
});

// Тип для полей формы
interface PaymentFormFields {
  userId?: string;
  amount: number;
  description: string;
  cellId?: string;          // Для обратной совместимости
  cellIds?: string[];       // Массив ID ячеек
  rentalDuration?: number;
}

const PaymentsPage = () => {
  const [expandedPayments, setExpandedPayments] = useState<string[]>([]);

  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<PaymentSortField>({
    defaultPageSize: 10
  });

  // Получение данных о платежах с учетом параметров
  const { data, error, isLoading, refetch } = useGetAllPaymentsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    search: tableControls.queryParams.search,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection as SortDirection,
  });

  const [getCells] = useLazyGetAdminCellsQuery();
  const [getClients] = useLazyGetClientsQuery()

  // Данные платежей из пагинированного ответа
  const payments = data?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;

  // Мутации для операций с платежами
  const [deletePayment] = useDeletePaymentMutation();
  const [adminCreatePayment] = useAdminCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<PaymentFormFields, Payment>({
    onSubmit: async (values) => {
      console.log(values);

      // Преобразуем данные формы для API
      const apiData = {
        ...values,
        // Если выбраны cellIds, используем их, иначе используем cellId для обратной совместимости
        cellIds: values.cellIds?.length ? values.cellIds : (values.cellId ? [values.cellId] : undefined),
        cellId: undefined // Убираем cellId, чтобы не было конфликтов
      };

      if (modal.editItem) {
        await updatePayment({
          id: modal.editItem.id,
          ...apiData
        }).unwrap();
        toast.success('Платеж успешно обновлен');
      } else {
        await adminCreatePayment(apiData as any).unwrap();
        toast.success('Платеж создан успешно');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении платежа');
    }
  });

  // Схема валидации зависит от режима (создание/редактирование)
  const validationSchema = useMemo(() => getPaymentValidationSchema(!!modal.editItem), [modal.editItem]);

  // Предзагруженные опции выбранных ячеек при редактировании
  const preselectedCellOptions = useMemo(() => {
    if (!modal.editItem) return [] as { label: string; value: string }[];
    const cells = (modal.editItem as any)?.cellRental?.cell;
    if (Array.isArray(cells) && cells.length) {
      return cells.map((cell: Cell) => ({
        label: cell.container?.location?.short_name ? `${cell.container.location.short_name}-${cell.name}` : cell.name,
        value: cell.id,
      }));
    }
    if ((modal.editItem as any)?.cellId) {
      const id = (modal.editItem as any).cellId as string;
      return [{ label: `Ячейка ${id}`, value: id }];
    }
    return [] as { label: string; value: string }[];
  }, [modal.editItem]);

  // Функция для переключения раскрытия информации о клиенте
  const toggleExpandPayment = (paymentId: string) => {
    setExpandedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Обработчик удаления
  const handleDelete = async (payment: Payment) => {
    if (window.confirm('Вы уверены, что хотите удалить этот платеж?')) {
      try {
        await deletePayment(payment.id).unwrap();
        toast.success('Платеж успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении платежа');
      }
    }
  };

  // Форматирование суммы - отображаем только целые рубли
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('ru-RU')}`;
  };

  // Компонент для отображения расширенной информации о клиенте
  const ExpandedClientInfo = ({ payment }: { payment: Payment }) => {
    const user = payment?.user;

    if (!user) {
      return (
        <div className="p-4 md:pl-12 text-sm text-gray-500">
          Информация о клиенте недоступна
        </div>
      );
    }

    return (
      <div className="pl-4 md:pl-12 pr-4 py-4 border-t border-gray-100 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <User size={16} />
            Информация о клиенте
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">ФИО:</p>
              <p className="font-medium">{user.client?.name}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email:</p>
              <p className="font-medium">{user?.email || 'Не указан'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500 dark:text-gray-400 mb-1">Телефоны:</p>
              <div className="font-medium space-y-1">
                {user.client.phones && user.client.phones.length > 0 ? (
                  user.client.phones.map((phone: any, index: number) => (
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
  const columns: ColumnDef<Payment>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => {
        const isExpanded = expandedPayments.includes(row.original.id);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandPayment(row.original.id);
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
      accessorKey: 'orderId',
      header: 'id Банка',
      cell: ({ row }) => (
        <div className="font-mono text-xs truncate max-w-[140px]" title={row.original.bankPaymentId}>
          {row.original.bankPaymentId ? row.original.bankPaymentId : "не указан"}
        </div>
      ),
    },
    {
      id: 'user',
      header: 'Клиент',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.user ? `${row.original.user?.client?.name} (${row.original.user?.email || 'Нет email'})` : 'Неизвестный клиент'}
          </div>
        );
      }
    },
    {
      id: 'amount',
      header: 'Сумма',
      cell: ({ row }) => {
        return <div>{formatAmount(row.original.amount)}</div>;
      }
    },
    {
      id: 'cellRental',
      header: "Ячейки",
      cell: ({ row }) => {
        const cells = row.original.cellRental?.cell;
        if (!cells || !Array.isArray(cells)) return '-';
        if (cells.length === 1) {
          return cells[0].name;
        }
        return `${cells.length} ячеек: ${cells.map(c => c.name).join(', ')}`;
      }
    },
    {
      accessorKey: 'rentalDuration',
      header: 'Дней аренды',
      cell: ({ getValue }) => getValue() || '-',
    },
    {
      accessorKey: 'description',
      header: 'Комментарий',
      cell: ({ getValue }) => {
        const value = String(getValue());
        const div = document.createElement('div');
        div.innerHTML = value;
        const decodedValue = div.textContent || div.innerText;
        return <div>{decodedValue}</div>;
      }
    },
    {
      id: 'createdAt',
      header: 'Дата создания',
      accessorFn: (row) => row.createdAt,
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ];

  // Поля формы для модального окна
  const modalFields = [
    {
      type: 'searchSelect' as const,
      fieldName: 'userId' as const,
      label: modal.editItem ? 'Изменить клиента' : 'Клиент',
      placeholder: modal.editItem ? 'Выберите нового клиента' : 'Выберите клиента',
      onSearch: async (q: string) => {
        const res = await getClients({ search: q, limit: 20 }).unwrap();
        return res.data.map(c => ({
          label: `${c.name} (${c.user?.email || 'Нет email'})`,
          value: c.userId
        }));
      },
      options: modal.editItem ? [{
        label: `${modal.editItem.user?.client?.name || 'Неизвестный клиент'} (${modal.editItem.user?.email || 'Нет email'})`,
        value: modal.editItem.userId
      }] : [],
    },
    {
      type: 'input' as const,
      inputType: "number",
      fieldName: 'amount' as const,
      label: 'Сумма',
      placeholder: 'Например: 5000'
    },
    {
      type: 'input' as const,
      inputType: 'number',
      fieldName: 'rentalDuration' as const,
      label: 'Срок аренды (дней)',
      placeholder: 'Например: 30'
    },
    {
      type: 'input' as const,
      fieldName: 'description' as const,
      label: 'Описание',
      placeholder: 'Опишите платеж'
    },
    {
      type: 'searchSelect' as const,
      fieldName: 'cellIds' as const,
      label: 'Ячейки',
      placeholder: 'Выберите ячейки для аренды',
      onSearch: async (q: string) => {
        const res = await getCells({ search: q, limit: 20 }).unwrap();
        return res.data.map(c => ({
          label: c.container?.location?.short_name ? `${c.container.location.short_name}-${c.name}` : c.name,
          value: c.id,
        }));
      },
      options: preselectedCellOptions,
      isMulti: true
    }
  ];

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
        {/* Заголовок страницы */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Платежи
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Управление платежами и арендой ячеек
          </p>
        </div>

        {/* Основной контент */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Панель добавления */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <Button 
                onClick={() => modal.openCreate()}
                className="w-full sm:w-auto touch-manipulation button-mobile"
                size="lg"
              >
                Добавить платеж
              </Button>
            </div>
          </div>

          {/* Таблица */}
          <div className="overflow-hidden">
            <BaseTable
              data={payments}
              columns={columns}
              searchColumn="orderId"
              searchPlaceholder="Поиск по ID платежа..."
              onEdit={modal.openEdit}
              onDelete={handleDelete}
              tableId="payments-table"
              editPermission='payments:update'
              deletePermission='payments:delete'
              totalCount={totalCount}
              pageCount={pageCount}
              onPaginationChange={tableControls.handlePaginationChange}
              onSortingChange={tableControls.handleSortingChange}
              onSearchChange={tableControls.handleSearchChange}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
              sortableFields={PaymentSortField}
              pagination={tableControls.pagination}
              sorting={tableControls.sorting}
              persistSettings={true}
              renderRowSubComponent={({ row }) =>
                expandedPayments.includes(row.original.id) ? <ExpandedClientInfo payment={row.original} /> : null
              }
            />
          </div>
        </div>

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать платеж' : 'Добавить платеж'}
        fields={modalFields}
        validationSchema={validationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? (() => {
          console.log(modal.editItem);
          const cells = (modal.editItem)?.cellRental?.cell;
          const cellIds = Array.isArray(cells) && cells.length ? cells.map((c) => c.id) : [];
          
          // Если есть текущий пользователь, показываем его как выбранного
          const currentUserId = modal.editItem.user?.id || modal.editItem.userId;
          
          return {
            userId: currentUserId,
            amount: modal.editItem.amount,
            description: modal.editItem.description,
            rentalDuration: modal.editItem.rentalDuration,
            cellIds: cellIds,
          };
        })() : {
          userId: undefined,
          amount: undefined,
          description: '',
          cellId: '',
          rentalDuration: undefined,
          cellIds: [],
        }}
      />
    </div>
  );
};

export default PaymentsPage;