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
  CreditCard
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

// Интерфейс для данных платежа в таблице
interface PaymentTableData extends Payment {
  formattedDate?: string;
  formattedAmount?: string;
}

const PaymentsPage = () => {
  const { data: payments = [], isLoading, error, refetch } = useGetAllPaymentsQuery();
  const { data: clients = [], isLoading: isLoadingClients } = useGetClientsQuery();
  const [adminCreatePayment, { isLoading: isCreating }] = useAdminCreatePaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
  const [setPaymentStatus] = useSetPaymentStatusMutation();
  
  const [tableData, setTableData] = useState<PaymentTableData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    userId: '',
    amount: '',
    description: '',
    status: false
  });
  
  const [activeTab, setActiveTab] = useState('all');
  
  // Модальное окно для редактирования платежа
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

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

  // Определение колонок таблицы
  const columns: ColumnDef<PaymentTableData>[] = [
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
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
            title="Редактировать платеж"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            disabled={isDeleting}
            title="Удалить платеж"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Обработчик создания нового платежа
  const handleCreatePayment = async () => {
    if (!newPayment.userId || !newPayment.amount || parseInt(newPayment.amount) < 10) {
      toast.error('Заполните все обязательные поля. Сумма должна быть не менее 10 рублей.');
      return;
    }

    try {
      // Создаем новый платеж через API
      const result = await adminCreatePayment({
        userId: newPayment.userId,
        amount: parseInt(newPayment.amount),
        description: newPayment.description,
        status: newPayment.status
      }).unwrap();
      
      // Сбрасываем форму
      setNewPayment({
        userId: '',
        amount: '',
        description: '',
        status: false
      });
      
      setIsAddDialogOpen(false);
      toast.success('Платеж создан успешно');
      
      refetch(); // Обновляем данные
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      toast.error('Не удалось создать платеж');
    }
  };

  // Обработчик редактирования платежа
  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setIsEditModalOpen(true);
  };

  // Обработчик сохранения отредактированного платежа
  const handleSaveEditedPayment = async (updatedPayment: any) => {
    try {
      await updatePayment(updatedPayment).unwrap();
      toast.success('Платеж успешно обновлен');
      setIsEditModalOpen(false);
      setEditingPayment(null);
      refetch();
    } catch (error) {
      console.error('Ошибка при обновлении платежа:', error);
      toast.error('Не удалось обновить платеж');
    }
  };

  // Обработчик удаления платежа
  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот платеж?')) {
      try {
        await deletePayment(id).unwrap();
        toast.success('Платеж удален');
        refetch();
      } catch (error) {
        console.error('Ошибка при удалении платежа:', error);
        toast.error('Не удалось удалить платеж');
      }
    }
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

  // Обработчик добавления новой строки
  const handleAddRow = () => {
    setIsAddDialogOpen(true);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление платежами</h1>
        
        <div className="flex items-center gap-4">
          <Button onClick={handleAddRow}>
            <CreditCard className="h-4 w-4 mr-1" />
            Создать платеж
          </Button>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создание платежа</DialogTitle>
            <DialogDescription>
              Заполните данные для создания нового платежа
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-gray-700 dark:text-gray-300">Выберите клиента</Label>
              <Select
                onValueChange={(value) => setNewPayment({...newPayment, userId: value})}
                value={newPayment.userId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingClients ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Загрузка клиентов...</span>
                    </div>
                  ) : clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.userId} value={client.userId}>
                        {client.name} ({client.user?.email || 'Без email'})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500 dark:text-gray-400">Нет доступных клиентов</div>
                  )}
                </SelectContent>
              </Select>
              
              {!isLoadingClients && clients.length === 0 && (
                <p className="text-xs text-yellow-500 dark:text-yellow-400">
                  Нет доступных клиентов. Создайте клиентов в разделе "Клиенты".
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">Сумма (руб.)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Введите сумму"
                min="10"
                step="1"
                value={newPayment.amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPayment({...newPayment, amount: e.target.value})}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Минимальная сумма: 10 рублей</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Описание (необязательно)</Label>
              <Textarea
                id="description"
                placeholder="Назначение платежа"
                value={newPayment.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewPayment({...newPayment, description: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="status" 
                checked={newPayment.status}
                onCheckedChange={(checked) => setNewPayment({...newPayment, status: checked as boolean})}
              />
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Отметить как оплаченный</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleCreatePayment}
              disabled={isCreating || !newPayment.userId || !newPayment.amount || parseInt(newPayment.amount) < 10}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Создание...
                </>
              ) : 'Создать платеж'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">Все платежи ({tableData.length})</TabsTrigger>
            <TabsTrigger value="paid">Оплаченные ({tableData.filter(p => p.status).length})</TabsTrigger>
            <TabsTrigger value="unpaid">Неоплаченные ({tableData.filter(p => !p.status).length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tableData.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-8 text-center">
          <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">Нет данных о платежах</p>
          <Button onClick={handleAddRow}>
            <CreditCard className="h-4 w-4 mr-1" />
            Создать первый платеж
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <BaseTable
            data={getFilteredData()}
            columns={columns}
            searchColumn="description"
            searchPlaceholder="Поиск по описанию..."
            pageSize={10}
            onRowClick={(row) => console.log('Clicked row:', row)}
            enableColumnReordering={true}
            persistColumnOrder={true}
            tableId="payments-table"
          />
        </div>
      )}

      {/* Модальное окно для редактирования платежа */}
      <PaymentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPayment(null);
        }}
        onSave={handleSaveEditedPayment}
        payment={editingPayment}
        title="Редактировать платеж"
      />
    </div>
  );
};

export default PaymentsPage;