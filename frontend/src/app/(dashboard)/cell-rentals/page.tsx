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
import { CellRental, CellRentalStatus } from '@/services/cellRentalsService/cellRentals.types';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormModal } from '@/hooks/useFormModal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { formatDate } from 'date-fns';

// Схема валидации для аренды ячейки
const cellRentalValidationSchema = yup.object({
  cellId: yup.string().required('ID ячейки обязательно'),
  clientId: yup.string().required('ID клиента обязательно'),
  startDate: yup.string().required('Дата начала обязательна'),
  endDate: yup.string().required('Дата окончания обязательна'),
  isActive: yup.boolean().required('Статус активности обязателен')
});

// Типы для формы
interface CellRentalFormFields {
  cellId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Цвета для статусов
const statusColors: Record<CellRentalStatus, string> = {
  [CellRentalStatus.ACTIVE]: 'bg-green-100 text-green-800 border-green-300',
  [CellRentalStatus.EXPIRING_SOON]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [CellRentalStatus.EXPIRED]: 'bg-red-100 text-red-800 border-red-300',
  [CellRentalStatus.CLOSED]: 'bg-gray-100 text-gray-800 border-gray-300',
  [CellRentalStatus.RESERVATION]: 'bg-blue-100 text-blue-800 border-blue-300',
  [CellRentalStatus.EXTENDED]: 'bg-purple-100 text-purple-800 border-purple-300',
  [CellRentalStatus.PAYMENT_SOON]: 'bg-orange-100 text-orange-800 border-orange-300'
};

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
  const [statusFilter, setStatusFilter] = useState<CellRentalStatus | 'ALL'>('ALL');
  
  // Получение данных об арендах
  const { data, error, isLoading, refetch } = useGetCellRentalsQuery({

  });
  
  // Данные аренд
  const cellRentals = data?.data || [];

  // Фильтрация ячеек
  const filteredRentals = cellRentals.filter(rental => {
    const matchesSearch = rental.cell?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         rental.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL';
    return matchesSearch && matchesStatus;
  });

  // Группировка по контейнерам (если нужно)
  // const containers = Array.from(new Set(cellRentals.map(r => r.cell?.container?.name)));

  // Мутации для операций с арендами
  const [createCellRental] = useCreateCellRentalMutation();
  const [updateCellRental] = useUpdateCellRentalMutation();
  const [deleteCellRental] = useDeleteCellRentalMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<CellRentalFormFields, CellRental>({
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
      type: 'input' as const,
      fieldName: 'cellId' as const,
      label: 'ID Ячейки',
      placeholder: 'Введите ID ячейки'
    },
    {
      type: 'input' as const,
      fieldName: 'clientId' as const,
      label: 'ID Клиента',
      placeholder: 'Введите ID клиента'
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
      type: 'checkbox' as const,
      fieldName: 'isActive' as const,
      label: 'Активна'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок и кнопка добавления */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Управление ячейками</h1>
          <p className="text-sm text-muted-foreground">
            Просмотр и управление арендами ячеек
          </p>
        </div>
        <Button onClick={modal.openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить аренду
        </Button>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по ячейке или клиенту..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        <div className="flex items-center justify-end">
          <Badge variant="outline" className="mr-2">
            Всего: {cellRentals.length}
          </Badge>
          <Badge variant="outline">
            Найдено: {filteredRentals.length}
          </Badge>
        </div>
      </div>

      {/* Список ячеек */}
      {filteredRentals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Ячейки не найдены</h3>
          <p className="text-sm text-muted-foreground">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRentals.map((rental) => (
            <Card key={rental.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    Ячейка {rental.cell?.name}
                  </CardTitle>
                  <Badge className={statusColors[rental.rentalStatus]}>
                    {statusTitles[rental.rentalStatus]}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Контейнер #{rental.cell?.container?.name}
                </div>
              </CardHeader>
              
              
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Клиент</p>
                  <p className="font-medium">{rental.client?.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <p className="font-medium">
                    {rental.client?.phones?.[0]?.phone || 'Не указан'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Начало</p>
                    <p className="font-medium">{formatDate(rental.startDate, 'dd.MM.yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Окончание</p>
                    <p className="font-medium">{formatDate(rental.endDate, 'dd.MM.yyyy')}</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => modal.openEdit(rental)}
                >
                  Редактировать
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => handleDelete(rental)}
                >
                  Удалить
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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
          startDate: modal.editItem.startDate,
          endDate: modal.editItem.endDate,
          isActive: modal.editItem.isActive
        } : {
          cellId: '',
          clientId: '',
          startDate: '',
          endDate: '',
          isActive: true
        }}
      />
    </div>
  );
}