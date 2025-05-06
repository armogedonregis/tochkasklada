'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetClientsQuery } from '@/services/clientsApi';
import { Payment, UpdatePaymentRequest } from '@/services/paymentsApi';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Тип для формы платежа
interface PaymentFormData {
  id: string;
  userId: string;
  amount: number;
  description: string;
  status: boolean;
}

// Параметры модального окна
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdatePaymentRequest) => void;
  payment: Payment | null;
  title?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSave,
  payment = null,
  title = 'Редактировать платеж',
}: PaymentModalProps) {
  const { data: clients = [], isLoading: isLoadingClients } = useGetClientsQuery();
  
  // Состояние формы
  const [formData, setFormData] = useState<PaymentFormData>({
    id: '',
    userId: '',
    amount: 0,
    description: '',
    status: false,
  });

  // Ошибки валидации
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Инициализация формы при открытии
  useEffect(() => {
    if (payment) {
      setFormData({
        id: payment.id,
        userId: payment.userId,
        amount: payment.amount,
        description: payment.description || '',
        status: payment.status,
      });
    } else {
      // Сбрасываем форму при открытии для создания нового платежа
      setFormData({
        id: '',
        userId: '',
        amount: 0,
        description: '',
        status: false,
      });
    }
    // Сбрасываем ошибки
    setErrors({});
  }, [payment, isOpen]);

  // Обработчик изменения полей формы
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Сбрасываем ошибку для поля при его изменении
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Проверка клиента
    if (!formData.userId.trim()) {
      newErrors.userId = 'Выберите клиента';
    }

    // Проверка суммы
    if (formData.amount <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик сохранения
  const handleSave = () => {
    if (validateForm()) {
      const updateData: UpdatePaymentRequest = {
        id: formData.id,
        amount: formData.amount,
        description: formData.description,
        status: formData.status,
      };
      onSave(updateData);
    } else {
      toast.error('Пожалуйста, исправьте ошибки в форме');
    }
  };

  // Найти имя клиента по ID
  const getClientName = (userId: string) => {
    const client = clients.find(c => c.userId === userId);
    return client ? `${client.name} (${client.user?.email || 'Нет email'})` : 'Неизвестный клиент';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Редактирование информации о платеже.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userId" className="text-right">
              Клиент
            </Label>
            <div className="col-span-3">
              {isLoadingClients ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Загрузка клиентов...</span>
                </div>
              ) : (
                <>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    {getClientName(formData.userId)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Клиента нельзя изменить
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Сумма (руб.)
            </Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', Number(e.target.value))}
              className={`col-span-3 ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="Введите сумму"
              min="1"
              step="1"
            />
            {errors.amount && (
              <div className="col-span-3 col-start-2 text-red-500 text-xs mt-1">
                {errors.amount}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Описание
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="col-span-3"
              placeholder="Введите описание платежа"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Статус
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox 
                id="status" 
                checked={formData.status}
                onCheckedChange={(checked) => handleChange('status', !!checked)}
              />
              <Label htmlFor="status">
                {formData.status ? 'Оплачен' : 'Не оплачен'}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" onClick={handleSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 