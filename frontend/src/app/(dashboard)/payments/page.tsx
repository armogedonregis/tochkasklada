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
import { EditableTable, EditableCell } from "@/components/table/EditableTable";
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
  
  // Для автосохранения
  const [autoSave, setAutoSave] = useState<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
      cell: ({ row, table }) => {
        // При редактировании отображаем выпадающий список клиентов
        const isNewRow = row.original.id.startsWith('temp-');
        
        // Если это новая строка или есть клиенты для выбора, делаем ячейку редактируемой
        if (isNewRow || clients.length > 0) {
          return (
            <div className="p-2">
              <Select
                value={row.original.userId}
                onValueChange={(value) => {
                  // Проверяем, что meta определена
                  if (table.options.meta) {
                    // Обновляем значение через meta.updateData
                    table.options.meta.updateData(row.index, 'userId', value);
                    // Также устанавливаем флаг несохраненных изменений
                    table.options.meta.setHasUnsavedChanges(true);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.userId} value={client.userId}>
                      {client.name} ({client.user?.email || 'Без email'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        
        // Для существующих платежей просто отображаем имя клиента
        const client = clients.find(c => c.userId === row.original.userId);
        return (
          <div className="p-2">
            {client ? `${client.name} (${client.user?.email || 'Нет email'})` : row.original.user?.email || 'Неизвестный клиент'}
          </div>
        );
      }
    },
    {
      id: 'amount',
      header: 'Сумма',
      accessorFn: (row) => formatAmount(row.amount),
      cell: (props) => {
        const { row, table } = props;
        // При редактировании показываем сумму в целых рублях без форматирования
        const editValue = row.original.amount.toString();
        
        return (
          <EditableCell 
            {...props} 
            getValue={() => editValue} 
          />
        );
      }
    },
    {
      accessorKey: 'description',
      header: 'Описание',
      cell: (props) => <EditableCell {...props} />,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row, table }) => {
        const status = row.original.status;
        const isNewRow = row.original.id.startsWith('temp-');
        
        // Для новых строк используем чекбокс
        if (isNewRow) {
          return (
            <div className="flex items-center justify-center p-2">
              <Checkbox 
                checked={status}
                onCheckedChange={(checked) => {
                  // Проверяем, что meta определена
                  if (table.options.meta) {
                    // Обновляем значение через meta.updateData
                    table.options.meta.updateData(row.index, 'status', !!checked);
                    // Также устанавливаем флаг несохраненных изменений
                    table.options.meta.setHasUnsavedChanges(true);
                  }
                }}
              />
              <span className="ml-2">{status ? 'Оплачен' : 'Не оплачен'}</span>
            </div>
          );
        }
        
        // Для существующих строк сохраняем текущую логику
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

  // Переключатель автосохранения
  const toggleAutoSave = () => {
    setAutoSave(prev => !prev);

    // Показываем уведомление
    if (!autoSave) {
      toast.info('Автосохранение включено. Изменения будут сохраняться автоматически после 2 секунд бездействия.');
    } else {
      toast.info('Автосохранение выключено. Не забывайте сохранять изменения вручную.');
    }
  };

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
      toast.success(`Статус платежа изменен на "${newStatus ? 'Оплачен' : 'Не оплачен'}"`);
      refetch();
    } catch (error) {
      console.error('Ошибка при изменении статуса платежа:', error);
      toast.error('Не удалось изменить статус платежа');
    }
  };

  // Добавление нового платежа в таблицу
  const handleAddRow = () => {
    setIsAddDialogOpen(true);
  };

  // Добавление новой строки непосредственно в таблицу
  const handleAddTableRow = () => {
    // Создаем новую пустую строку со всеми необходимыми полями
    const newRow: PaymentTableData = {
      id: `temp-${Date.now()}`, // Временный ID, который заменится на сервере
      amount: 0,
      orderId: `temp-${Date.now()}`,
      description: '',
      userId: clients.length > 0 ? clients[0].userId : '',
      status: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Добавляем форматированные поля
    newRow.formattedDate = formatDate(newRow.createdAt);
    newRow.formattedAmount = formatAmount(newRow.amount);
    
    // Добавляем строку в таблицу
    const updatedData = [...tableData, newRow];
    setTableData(updatedData);
    
    // Устанавливаем флаг несохраненных изменений
    setHasUnsavedChanges(true);
    
    toast.info('Добавлена новая строка. Не забудьте сохранить изменения.');
  };

  // Обработчик сохранения изменений в таблице
  const handleSaveChanges = async (updatedData: PaymentTableData[]) => {
    try {
      const promises = [];
      const newRowPromises = [];

      for (const payment of updatedData) {
        // Проверяем, является ли это новой строкой (по временному ID)
        const isNewRow = payment.id.startsWith('temp-');
        
        if (isNewRow) {
          // Для новых строк создаем новый платеж
          // Проверяем, что все обязательные поля заполнены
          if (!payment.userId || payment.amount < 10) {
            toast.error(`Строка с временным ID ${payment.id.substring(0, 8)}... содержит неверные данные. Заполните все поля.`);
            continue;
          }
          
          // Создаем новый платеж
          const newPaymentData = {
            userId: payment.userId,
            amount: payment.amount,
            description: payment.description || '',
            status: payment.status
          };
          
          newRowPromises.push(adminCreatePayment(newPaymentData).unwrap());
          continue;
        }
        
        // Для существующих строк обновляем данные
        const originalPayment = payments.find(p => p.id === payment.id);
        if (!originalPayment) continue;

        // Создаем объект с изменениями
        const changes: any = { id: payment.id };
        let hasChanges = false;

        // Обработка суммы - работаем только с целыми рублями
        const originalAmount = originalPayment.amount;
        
        // Получаем новое значение
        let newAmount = originalAmount; // По умолчанию оставляем прежнее значение
        
        try {
          // В EditableTable значение может быть как строкой, так и числом
          const rawAmount = payment.amount;
          
          // Работаем со строковым представлением, которое возможно от EditableCell
          if (typeof rawAmount === 'string') {
            // Очищаем строку от всего кроме чисел
            const cleanAmount = (rawAmount as string).replace(/[^\d]/g, '');
            if (cleanAmount) {
              newAmount = parseInt(cleanAmount, 10);
            }
          } else if (typeof rawAmount === 'number') {
            // Если это число, используем его напрямую, округляя до целого
            newAmount = Math.round(rawAmount);
          }
        } catch (err) {
          console.warn('Ошибка при обработке суммы', err);
          // Продолжаем с исходным значением
        }
        
        console.log('Исходная сумма в рублях:', originalAmount);
        console.log('Новая сумма в рублях:', newAmount);
        
        // Проверяем, изменилась ли сумма
        if (newAmount !== originalAmount && !isNaN(newAmount)) {
          // Проверяем на разумные пределы
          if (newAmount > 0 && newAmount <= 10000000) {
            changes.amount = newAmount;
            hasChanges = true;
            console.log('Сумма для сохранения:', newAmount);
          } else {
            console.error('Сумма выходит за допустимые пределы:', newAmount);
            toast.error('Недопустимая сумма. Диапазон: от 1₽ до 10,000,000₽');
          }
        }

        // Проверяем, изменилось ли описание
        if (payment.description !== originalPayment.description) {
          changes.description = payment.description;
          hasChanges = true;
        }

        // Если были изменения, отправляем запрос
        if (hasChanges) {
          promises.push(updatePayment(changes).unwrap());
        }
      }

      // Выполняем все запросы
      if (promises.length > 0 || newRowPromises.length > 0) {
        // Сначала создаем новые платежи
        if (newRowPromises.length > 0) {
          await Promise.all(newRowPromises);
          toast.success(`Создано новых платежей: ${newRowPromises.length}`);
        }
        
        // Затем обновляем существующие
        if (promises.length > 0) {
          await Promise.all(promises);
          toast.success(`Обновлено платежей: ${promises.length}`);
        }
        
        // Сбрасываем флаг несохраненных изменений
        setHasUnsavedChanges(false);
        
        // Обновляем данные
        refetch();
      } else {
        toast.info("Нет изменений для сохранения");
      }
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
      toast.error('Не удалось сохранить изменения');
    }
  };

  // Валидация ячеек таблицы
  const validateCell = (value: any, columnId: string, rowData: any): { isValid: boolean; errorMessage?: string } => {
    if (columnId === 'amount') {
      // Очищаем значение от нечисловых символов
      const cleanValue = value.toString().replace(/[^\d]/g, '');
      const numValue = parseInt(cleanValue, 10);
      
      // Проверки на разумность значения
      if (isNaN(numValue)) {
        return { 
          isValid: false, 
          errorMessage: 'Введите корректное целое число' 
        };
      }
      
      if (numValue < 10) {
        return { 
          isValid: false, 
          errorMessage: 'Сумма должна быть не менее 10 рублей' 
        };
      }
      
      if (numValue > 10000000) {
        return { 
          isValid: false, 
          errorMessage: 'Сумма не должна превышать 10 миллионов рублей' 
        };
      }
    } else if (columnId === 'userId') {
      // Проверяем, что выбран клиент
      if (!value) {
        return { 
          isValid: false, 
          errorMessage: 'Выберите клиента' 
        };
      }
    }
    return { isValid: true };
  };

  // Обработчик изменения данных таблицы для автосохранения
  const handleDataChange = (updatedData: PaymentTableData[]) => {
    // Сохраняем обновленные данные
    setTableData(updatedData);

    // Если автосохранение выключено, просто обновляем данные
    if (!autoSave) return;

    // Очищаем предыдущий таймер при каждом вызове
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Иначе запускаем таймер для автосохранения через 2 секунды
    // после последнего изменения
    autoSaveTimerRef.current = setTimeout(() => {
      handleSaveChanges(updatedData);
    }, 2000);
  };

  // Адаптер для преобразования индекса в ID для EditableTable
  const handleRowDelete = (index: number) => {
    if (tableData[index]) {
      handleDelete(tableData[index].id);
    }
  };

  // Получить имя клиента по ID
  const getClientName = (userId: string) => {
    const client = clients.find(c => c.userId === userId);
    if (client) {
      return `${client.name} (${client.user?.email || 'Без email'})`;
    }
    return null;
  };

  // Обработчик изменения вкладки
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Загрузка платежей...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
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
        <h1 className="text-2xl font-bold">Управление платежами</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              checked={autoSave}
              onChange={toggleAutoSave}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="autoSave" className="text-sm">
              Автосохранение
            </label>
          </div>

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
              <Label htmlFor="userId">Выберите клиента</Label>
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
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Загрузка клиентов...</span>
                    </div>
                  ) : clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.userId} value={client.userId}>
                        {client.name} ({client.user?.email || 'Без email'})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">Нет доступных клиентов</div>
                  )}
                </SelectContent>
              </Select>
              
              {!isLoadingClients && clients.length === 0 && (
                <p className="text-xs text-yellow-500">
                  Нет доступных клиентов. Создайте клиентов в разделе "Клиенты".
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма (руб.)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Введите сумму"
                min="10"
                step="1"
                value={newPayment.amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPayment({...newPayment, amount: e.target.value})}
              />
              <p className="text-xs text-gray-500">Минимальная сумма: 10 рублей</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание (необязательно)</Label>
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
              <Label htmlFor="status">Отметить как оплаченный</Label>
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
          onValueChange={handleTabChange}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-lg mb-4">Нет данных о платежах</p>
          <Button onClick={handleAddRow}>
            <CreditCard className="h-4 w-4 mr-1" />
            Создать первый платеж
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <EditableTable
            data={getFilteredData()}
            columns={columns}
            searchColumn="user"
            searchPlaceholder="Поиск по клиенту..."
            onRowAdd={handleAddTableRow}
            onSaveChanges={handleSaveChanges}
            onDataChange={handleDataChange}
            onRowDelete={handleRowDelete}
            validateCell={validateCell}
            addRowButtonText="Добавить строку"
            saveButtonText="Сохранить изменения"
            exportFilename={`payments-${activeTab}.xlsx`}
            autoSaveTimeout={autoSave ? 2000 : 0}
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;