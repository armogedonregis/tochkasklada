import React, { useState, useEffect } from 'react';
import { useGetLocationPaymentsQuery } from '@/services/statisticsService/statisticsApi';
import { LocationPaymentDetail, LocationPaymentSortField } from '@/services/statisticsService/statistics.types';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTableControls } from '@/hooks/useTableControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Phone, Mail, Calendar, MapPin } from 'lucide-react';

interface LocationPaymentsDetailProps {
  locationId: string;
  locationName: string;
  startDate?: Date;
  endDate?: Date;
  isOpen: boolean;
  onToggle: () => void;
}

const LocationPaymentsDetail: React.FC<LocationPaymentsDetailProps> = ({
  locationId,
  locationName,
  startDate,
  endDate,
  isOpen,
  onToggle
}) => {
  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<LocationPaymentSortField>({
    defaultPageSize: 10,
    defaultSorting: [{ id: LocationPaymentSortField.CREATED_AT, desc: true }]
  });

  // Получение данных о платежах
  const { data, error, isLoading, refetch } = useGetLocationPaymentsQuery({
    locationId,
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  }, {
    skip: !isOpen, // Загружаем данные только если компонент открыт
  });

  // Обновляем данные при изменении дат
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [startDate, endDate, isOpen, refetch]);

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  // Форматирование короткой даты
  const formatShortDate = (date: Date) => {
    return format(date, 'dd.MM.yyyy', { locale: ru });
  };

  // Экспорт в Excel
  const handleExport = async () => {
    try {
      const XLSX = await import('xlsx');
      
      const exportData = data?.data.map(payment => ({
        'ID платежа': payment.id,
        'Сумма': payment.amount,
        'Описание': payment.description || '',
        'Дата создания': formatDate(payment.createdAt),
        'ID заказа': payment.orderId || '',
        'Bank Payment ID': payment.bankPaymentId || '',
        'Email клиента': payment.user.email,
        'Имя клиента': payment.user.client?.name || '',
        'Телефоны': payment.user.client?.phones.map(p => p.phone).join(', ') || '',
        'Ячейка': payment.cellRental?.cell.name || '',
        'Контейнер': payment.cellRental?.cell.container.name || '',
        'Дата начала аренды': payment.cellRental?.startDate ? formatDate(payment.cellRental.startDate) : '',
        'Дата окончания аренды': payment.cellRental?.endDate ? formatDate(payment.cellRental.endDate) : '',
        'Статус аренды': payment.cellRental?.isActive ? 'Активна' : 'Неактивна',
      })) || [];

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Платежи');
      
      const fileName = `платежи_${locationName}_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  };

  // Определение колонок таблицы
  const columns: ColumnDef<LocationPaymentDetail>[] = [
    {
      accessorKey: 'bankPaymentId',
      header: 'ID Банка',
      cell: ({ row }) => (
        <div className="font-mono text-xs truncate max-w-[140px]" title={row.original.bankPaymentId || ''}>
          {row.original.bankPaymentId || "не указан"}
        </div>
      ),
    },
    {
      id: 'client',
      header: 'Клиент',
      cell: ({ row }) => {
        const client = row.original.user.client;
        return (
          <div>
            {client?.name ? `${client.name} (${row.original.user.email})` : `Неизвестен (${row.original.user.email})`}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Сумма',
      cell: ({ row }) => (
        <div className="font-semibold">
          {formatAmount(row.original.amount)}
        </div>
      ),
    },
    {
      id: 'rental',
      header: 'Ячейка',
      cell: ({ row }) => {
        const rental = row.original.cellRental;
        if (!rental) return <span className="text-gray-400">Нет данных</span>;
        
        return (
          <div>
            {rental.cell.container.name} - {rental.cell.name}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Комментарий',
      cell: ({ row }) => {
        const description = row.original.description;
        if (!description) return '-';
        
        // Декодируем HTML если есть
        const div = document.createElement('div');
        div.innerHTML = description;
        const decodedValue = div.textContent || div.innerText || description;
        
        return (
          <div className="max-w-xs truncate" title={decodedValue}>
            {decodedValue}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const rental = row.original.cellRental;
        if (!rental) return <span className="text-gray-400">Нет данных</span>;
        
        const isActive = rental.rentalStatus !== 'CLOSED';
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Активна' : 'Завершена'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ];

  // Если компонент не открыт, не рендерим
  if (!isOpen) return null;

  // Формируем описание периода
  let periodDescription = `Все платежи по локации "${locationName}"`;
  if (startDate && endDate) {
    periodDescription += ` за период ${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;
  } else if (startDate) {
    periodDescription += ` с ${formatShortDate(startDate)}`;
  } else if (endDate) {
    periodDescription += ` до ${formatShortDate(endDate)}`;
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Детальные платежи</CardTitle>
              <CardDescription>
                {periodDescription}
              </CardDescription>
              {data?.meta && (
                <div className="text-sm text-muted-foreground mt-1">
                  Найдено платежей: {data.meta.totalCount}
                </div>
              )}
            </div>
            <Button onClick={handleExport} variant="outline" size="sm" disabled={!data?.data.length}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BaseTable
            data={data?.data || []}
            columns={columns}
            tableId={`location-payments-${locationId}`}
            totalCount={data?.meta?.totalCount || 0}
            pageCount={data?.meta?.totalPages || 1}
            onPaginationChange={tableControls.handlePaginationChange}
            onSortingChange={tableControls.handleSortingChange}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            sortableFields={LocationPaymentSortField}
            pagination={tableControls.pagination}
            sorting={tableControls.sorting}
            persistSettings={true}
            disableActions={true}
            searchPlaceholder="Поиск не доступен для детальных платежей"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPaymentsDetail; 