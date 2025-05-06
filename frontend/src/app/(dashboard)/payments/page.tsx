'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { 
  useGetAllPaymentsQuery, 
  useAdminCreatePaymentMutation, 
  useUpdatePaymentMutation, 
  useDeletePaymentMutation,
  useSetPaymentStatusMutation,
  Payment
} from '@/services/paymentsApi';
import { useGetClientsQuery } from '@/services/clientsApi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Edit, 
  Save, 
  Loader2, 
  CreditCard,
  ChevronDown,
  ChevronRight,
  User
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BaseTable } from "@/components/table/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { PaymentModal } from '@/components/modals/PaymentModal';
import type { TableMeta } from "@tanstack/react-table";

// Расширяю тип TableMeta для использования с нашими данными
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    updateData: (rowIndex: number, columnId: string, value: any) => void;
    setHasUnsavedChanges: (value: boolean) => void;
  }
}

// Расширяем интерфейс для данных платежа
interface PaymentTableData extends Payment {
  formattedDate?: string;
  formattedAmount?: string;
  expanded?: boolean;
}

const PaymentsPage = () => {
  const { data: payments = [], isLoading, error, refetch } = useGetAllPaymentsQuery();
  const { data: clients = [], isLoading: isLoadingClients } = useGetClientsQuery();
  const [adminCreatePayment, { isLoading: isCreating }] = useAdminCreatePaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
  const [setPaymentStatus] = useSetPaymentStatusMutation();
  
  const [tableData, setTableData] = useState<PaymentTableData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPayments, setExpandedPayments] = useState<string[]>([]);

  // Конвертируем данные платежей для отображения в таблице
  useEffect(() => {
    if (payments && payments.length > 0) {
      setTableData(
        payments.map(payment => ({
          ...payment,
          formattedDate: formatDate(payment.createdAt),
          formattedAmount: formatAmount(payment.amount)
        }))
      );
    }
  }, [payments]);

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
    return `${date.toLocaleDateString('ru-RU')} (${formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: ru
    })})`;
  };

  // Функция для переключения раскрытия информации о клиенте
  const toggleExpandPayment = (paymentId: string) => {
    setExpandedPayments(prev => 
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Компонент для отображения расширенной информации о клиенте
  const ExpandedClientInfo = ({ payment }: { payment: PaymentTableData }) => {
    const client = clients.find(c => c.userId === payment.userId);
    const user = client?.user;

    if (!client) {
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
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email:</p>
              <p className="font-medium">{user?.email || 'Не указан'}</p>
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
  const columns: ColumnDef<PaymentTableData>[] = [
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
      header: 'ID платежа',
      cell: ({ getValue }) => (
        <div className="font-mono text-xs truncate max-w-[140px]" title={getValue() as string}>
          {getValue() as string}
        </div>
      ),
    },
    {
      id: 'user',
      header: 'Клиент',
      accessorFn: (row) => {
        const client = clients.find(c => c.userId === row.userId);
        return client ? `${client.name} (${client.user?.email || 'Нет email'})` : row.user?.email || 'Неизвестный клиент';
      },
      cell: ({ row }) => {
        // Отображаем только имя клиента
        const client = clients.find(c => c.userId === row.original.userId);
        return (
          <div>
            {client ? `${client.name} (${client.user?.email || 'Нет email'})` : row.original.user?.email || 'Неизвестный клиент'}
          </div>
        );
      }
    },
    {
      id: 'amount',
      header: 'Сумма',
      accessorFn: (row) => formatAmount(row.amount),
      cell: ({ getValue }) => {
        return <div>{String(getValue())}</div>;
      }
    },
    {
      accessorKey: 'description',
      header: 'Описание',
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
      accessorFn: (row) => row.formattedDate || formatDate(row.createdAt),
    },
  ];

  // Обработчик сохранения платежа (создание/редактирование)
  const handleSaveFromModal = async (paymentData: any) => {
    try {
      if (editingPayment) {
        // Обновление существующего платежа
        await updatePayment({
          id: editingPayment.id,
          ...paymentData
        }).unwrap();
        toast.success('Платеж успешно обновлен');
      } else {
        // Создание нового платежа
        await adminCreatePayment(paymentData).unwrap();
        toast.success('Платеж создан успешно');
      }
      
      setIsModalOpen(false);
      setEditingPayment(null);
      refetch();
    } catch (error) {
      console.error('Ошибка при сохранении платежа:', error);
      toast.error(`Ошибка при ${editingPayment ? 'обновлении' : 'создании'} платежа`);
    }
  };

  // Открыть модальное окно для создания платежа
  const handleOpenCreateModal = () => {
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  // Открыть модальное окно для редактирования платежа
  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  // Закрыть модальное окно
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  // Обработчик удаления платежа
  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот платеж?')) {
      try {
        await deletePayment(id).unwrap();
        toast.success('Платеж удален');
        await refetch(); // Явно обновляем список после удаления
      } catch (error) {
        console.error('Ошибка при удалении платежа:', error);
        toast.error('Не удалось удалить платеж');
      }
    }
  };

  // Адаптер для передачи функции удаления в BaseTable
  const handleDeleteAdapter = async (payment: PaymentTableData) => {
    await handleDelete(payment.id);
  };

  // Обработчик изменения статуса платежа
  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      await setPaymentStatus({ id, status: newStatus }).unwrap();
      toast.success(`Статус платежа ${newStatus ? 'оплачен' : 'не оплачен'}`);
      refetch();
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
      toast.error('Не удалось изменить статус платежа');
    }
  };

  // Фильтруем данные по вкладке
  const getFilteredData = () => {
    switch (activeTab) {
      case 'paid':
        return tableData.filter(p => p.status);
      case 'unpaid':
        return tableData.filter(p => !p.status);
      default:
        return tableData;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-gray-700 dark:text-gray-300">Загрузка платежей...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
        <p>Ошибка при загрузке платежей.</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => refetch()}
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление платежами</h1>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Новый платеж</span>
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Все платежи</TabsTrigger>
          <TabsTrigger value="paid">Оплаченные</TabsTrigger>
          <TabsTrigger value="unpaid">Неоплаченные</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
        <BaseTable
          data={getFilteredData()}
          columns={columns}
          searchColumn="orderId"
          searchPlaceholder="Поиск по ID платежа..."
          pageSize={10}
          enableColumnReordering={true}
          persistColumnOrder={true}
          tableId="payments-table"
          enableActions={true}
          onEdit={handleEdit}
          onDelete={handleDeleteAdapter}
          renderRowSubComponent={({ row }) => 
            expandedPayments.includes(row.original.id) ? <ExpandedClientInfo payment={row.original} /> : null
          }
        />
      </div>

      {/* Модальное окно для создания/редактирования платежа */}
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFromModal}
        payment={editingPayment}
        clients={clients}
        title={editingPayment ? 'Редактировать платеж' : 'Создать новый платеж'}
      />
    </div>
  );
};

export default PaymentsPage;