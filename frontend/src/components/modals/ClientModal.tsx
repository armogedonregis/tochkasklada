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
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Client } from '@/services/clientsApi';
import { toast } from 'react-toastify';
import { formatPhoneForSaving, generateTempId } from '@/lib/phoneUtils';

// Тип для формы клиента
interface ClientFormData {
  name: string;
  email: string;
  phones: { id: string; number: string }[];
}

// Параметры модального окна
interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
  client?: Client | null;
  title?: string;
}

export function ClientModal({
  isOpen,
  onClose,
  onSave,
  client = null,
  title = 'Новый клиент',
}: ClientModalProps) {
  // Состояние формы
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phones: [{ id: generateTempId(), number: '' }],
  });

  // Ошибки валидации
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Инициализация формы при открытии
  useEffect(() => {
    if (client) {
      // Преобразуем телефоны клиента
      const phones = Array.isArray(client.phones) && client.phones.length > 0
        ? client.phones.map(p => {
            // Получаем номер телефона из разных форматов
            let number = '';
            if (typeof p === 'object' && p !== null) {
              if ('number' in p) number = p.number;
              else if ('phone' in p) number = (p as any).phone;
              else number = String(p);
            } else {
              number = String(p);
            }
            
            return {
              id: typeof p === 'object' && p !== null && 'id' in p ? p.id : generateTempId(),
              number: formatPhoneForSaving(number)
            };
          })
        : [{ id: generateTempId(), number: '' }];

      // Получаем email из user.email (если есть) или из обратной совместимости
      const email = client.user?.email || (client as any).email || '';

      setFormData({
        name: client.name || '',
        email: email,
        phones,
      });
    } else {
      // Сбрасываем форму при открытии для создания нового клиента
      setFormData({
        name: '',
        email: '',
        phones: [{ id: generateTempId(), number: '' }],
      });
    }
    // Сбрасываем ошибки
    setErrors({});
  }, [client, isOpen]);

  // Обработчик изменения полей формы
  const handleChange = (field: string, value: string) => {
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

  // Обработчик изменения номера телефона
  const handlePhoneChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.map((phone) =>
        phone.id === id ? { ...phone, number: value } : phone
      ),
    }));

    // Сбрасываем ошибки для телефонов
    if (errors.phones) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phones;
        return newErrors;
      });
    }
  };

  // Добавление нового телефона
  const handleAddPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [
        ...prev.phones,
        { id: generateTempId(), number: '' },
      ],
    }));
  };

  // Удаление телефона
  const handleRemovePhone = (id: string) => {
    if (formData.phones.length <= 1) {
      toast.warning('Клиент должен иметь хотя бы один номер телефона');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((phone) => phone.id !== id),
    }));
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Проверка имени
    if (!formData.name.trim()) {
      newErrors.name = 'ФИО обязательно';
    }

    // Проверка email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    // Проверка телефонов
    const validPhones = formData.phones.filter(
      (phone) => phone.number.trim().length > 0
    );

    if (validPhones.length === 0) {
      newErrors.phones = 'Введите хотя бы один номер телефона';
    } else {
      // Проверяем минимальную длину номера (12 символов: +7 и 10 цифр)
      for (const phone of validPhones) {
        if (phone.number.length < 12) {
          newErrors.phones = 'Телефон должен содержать не менее 10 цифр';
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик сохранения
  const handleSave = () => {
    if (validateForm()) {
      // Фильтруем пустые номера телефонов и форматируем их
      const dataToSave = {
        ...formData,
        phones: formData.phones
          .filter((phone) => phone.number.trim().length > 0)
          .map(phone => ({ 
            ...phone, 
            number: formatPhoneForSaving(phone.number) 
          }))
      };
      onSave(dataToSave);
    } else {
      toast.error('Пожалуйста, исправьте ошибки в форме');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Заполните информацию о клиенте. Все поля обязательны.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              ФИО
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`col-span-3 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Иванов Иван Иванович"
            />
            {errors.name && (
              <div className="col-span-3 col-start-2 text-red-500 text-xs mt-1">
                {errors.name}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`col-span-3 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="example@email.com"
              type="email"
            />
            {errors.email && (
              <div className="col-span-3 col-start-2 text-red-500 text-xs mt-1">
                {errors.email}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Телефоны</Label>
            <div className="col-span-3 space-y-2">
              {formData.phones.map((phone, index) => (
                <div key={phone.id} className="flex gap-2 items-center">
                  <PhoneInput
                    value={phone.number}
                    onChange={(value) => handlePhoneChange(phone.id, value)}
                    error={!!errors.phones}
                    aria-label={`Телефон ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleRemovePhone(phone.id)}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                type="button"
                onClick={handleAddPhone}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить телефон
              </Button>
              {errors.phones && (
                <div className="text-red-500 text-xs mt-1">{errors.phones}</div>
              )}
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