'use client';

import { useState, useMemo } from 'react';
import {
  useGetAllPaymentsQuery,
  useAdminCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useSetPaymentStatusMutation,
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
import { differenceInDays } from 'date-fns';
import * as yup from 'yup';
import { Payment, PaymentSortField } from '@/services/paymentsService/payments.types';
import { SortDirection } from '@/services/services.types';
import { Client } from '@/services/clientsService/clients.types';
import { useLazyGetAdminCellsQuery } from '@/services/cellService/cellsApi';
import { Cell } from '@/services/cellService/cell.types';

// Функция для создания схемы валидации (userId обязателен только при создании)
const getPaymentValidationSchema = (isEdit: boolean) => yup.object({
  userId: isEdit ? yup.string().optional() : yup.string().required('Клиент обязателен'),
  amount: yup.number().required('Сумма обязательна').min(1, 'Сумма должна быть больше 0'),
  description: yup.string().optional(),
  status: yup.boolean().default(false),
  cellId: yup.string().optional(),
  rentalDuration: yup.number().optional().min(1, 'Срок аренды должен быть > 0').nullable(),
});

// Тип для полей формы
interface PaymentFormFields {
  userId?: string;
  amount: number;
  description: string;
  status: boolean;
  cellId: string;
  rentalDuration?: number;
}

const PaymentsPage = () => {
  const [expandedPayments, setExpandedPayments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

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
    onlyPaid: activeTab === 'paid' ? true : activeTab === 'unpaid' ? false : undefined
  });

  const [getCells, { data: cellsData = { data: [] } }] = useLazyGetAdminCellsQuery();
  const [getClients, { data: clientsData = { data: [] } }] = useLazyGetClientsQuery()

  // Данные платежей из пагинированного ответа
  const payments = data?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;

  // Мутации для операций с платежами
  const [deletePayment] = useDeletePaymentMutation();
  const [adminCreatePayment] = useAdminCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [setPaymentStatus] = useSetPaymentStatusMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<PaymentFormFields, Payment>({
    onSubmit: async (values) => {
      console.log(values);
      if (modal.editItem) {
        await updatePayment({
          id: modal.editItem.id,
          ...values
        }).unwrap();
        toast.success('Платеж успешно обновлен');
      } else {
        await adminCreatePayment(values as any).unwrap();
        toast.success('Платеж создан успешно');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении платежа');
    }
  });

  // Схема валидации зависит от режима (создание/редактирование)
  const validationSchema = useMemo(() => getPaymentValidationSchema(!!modal.editItem), [modal.editItem]);

  // Опция текущей ячейки для селекта при редактировании
  const currentCellOption = useMemo(() => {
    if (!modal.editItem) return null;
    const cell: Cell | undefined = (modal.editItem as any).cellRental?.cell;
    console.log(modal.editItem)
    if (cell) {
      const locShort = cell.container?.location?.short_name;
      return {
        label: locShort ? `${locShort}-${cell.name}` : cell.name,
        value: cell.id
      };
    }
    if ((modal.editItem as any).cellId) {
      return { label: `Ячейка ${(modal.editItem as any).cellId}`, value: (modal.editItem as any).cellId };
    }
    return null;
  }, [modal.editItem]);

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

  // Обработчик изменения статуса платежа
  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      await setPaymentStatus({ id, status: newStatus }).unwrap();
      toast.success(`Статус платежа ${newStatus ? 'оплачен' : 'не оплачен'}`);
    } catch (error) {
      toast.error('Не удалось изменить статус платежа');
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
        <div className="p-4 pl-12 text-sm text-gray-500">
          Информация о клиенте недоступна
        </div>
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
              <p className="font-medium">{user.client?.name}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email:</p>
              <p className="font-medium">{user?.email || 'Не указан'}</p>
            </div>
            <div className="col-span-2">
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
      header: "Ячейка",
      cell: ({ row }) => {
        return row.original.cellRental?.cell?.name;
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
        return <div>{String(getValue())}</div>;
      }
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="flex items-center space-x-2">
            <Badge variant={status ? "default" : "secondary"}>
              {status ? 'Оплачен' : 'Не оплачен'}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleToggleStatus(row.original.id, !status)}
              title={status ? 'Отметить как неоплаченный' : 'Отметить как оплаченный'}
            >
              {status ?
                <X className="h-4 w-4 text-red-500" /> :
                <Check className="h-4 w-4 text-green-500" />
              }
            </Button>
          </div>
        );
      },
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
    // Показываем выбор клиента только при создании платежа
    ...(!modal.editItem ? [{
      type: 'searchSelect' as const,
      fieldName: 'userId' as const,
      label: 'Клиент',
      placeholder: 'Выберите клиента',
      onSearch: handleClientsSearch,
      options: clientsData.data.map((client: Client) => ({
        label: `${client.name} (${client.user?.email || 'Нет email'})`,
        value: client.userId
      }))
    }] : []),
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
      type: 'checkbox' as const,
      fieldName: 'status' as const,
      label: 'Оплачен'
    },
    {
      type: 'searchSelect' as const,
      fieldName: 'cellId' as const,
      label: 'Ячейка',
      placeholder: 'Введите ID ячейки',
      onSearch: handleCellsSearch,
      options: [
        ...cellsData?.data.map((cell: any) => ({
          label: cell.container?.location?.short_name 
            ? `${cell.container.location.short_name}-${cell.name}`
            : cell.name,
          value: cell.id
        }))
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={() => modal.openCreate()}>
          Добавить платеж
        </Button>
      </div>

      {/* Вкладки */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6 px-4">
        <TabsList>
          <TabsTrigger value="all">Все платежи</TabsTrigger>
          <TabsTrigger value="paid">Оплаченные</TabsTrigger>
          <TabsTrigger value="unpaid">Неоплаченные</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Таблица */}
      <BaseTable
        data={payments}
        columns={columns}
        searchColumn="orderId"
        searchPlaceholder="Поиск по ID платежа..."
        onEdit={modal.openEdit}
        onDelete={handleDelete}
        tableId="payments-table"
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

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать платеж' : 'Добавить платеж'}
        fields={modalFields}
        validationSchema={validationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          amount: modal.editItem.amount,
          description: modal.editItem.description,
          status: modal.editItem.status,
          cellId: modal.editItem.cellRental?.cell?.id || '',
          rentalDuration: modal.editItem.rentalDuration
        } : {
          userId: '',
          amount: undefined,
          description: '',
          status: false,
          cellId: '',
          rentalDuration: undefined
        }}
      />
    </div>
  );
};

export default PaymentsPage;