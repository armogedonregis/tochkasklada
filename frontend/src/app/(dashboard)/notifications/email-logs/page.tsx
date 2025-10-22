"use client";

import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { useTableControls } from '@/hooks/useTableControls';
import { Eye, Mail, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { Badge } from '@/components/ui/badge';
import { useGetEmailLogsQuery, useGetEmailStatsQuery } from '@/services/notifications/notificationsService';
import { EmailLog, EmailLogSortField, EmailType, EmailStatus, EmailLogFilters } from '@/services/notifications/emailLogs.types';

export default function EmailLogsPage() {
  const router = useRouter();

  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<EmailLogSortField>({
    defaultPageSize: 10,
  });

  // Получение данных о email логах
  const { data, error, isLoading, refetch } = useGetEmailLogsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection
  });

  // Получение статистики
  const { data: stats } = useGetEmailStatsQuery();

  // Функция для отображения типа email
  const getEmailTypeLabel = (type: EmailType) => {
    switch (type) {
      case EmailType.RENTAL_EXPIRATION:
        return 'Окончание аренды';
      case EmailType.PAYMENT_REMINDER:
        return 'Напоминание о платеже';
      case EmailType.RENTAL_EXTENDED:
        return 'Продление аренды';
      default:
        return 'Другое';
    }
  };

  // Функция для отображения статуса
  const getStatusVariant = (status: EmailStatus) => {
    switch (status) {
      case EmailStatus.SENT:
        return 'default';
      case EmailStatus.FAILED:
        return 'destructive';
      case EmailStatus.PENDING:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: EmailStatus) => {
    switch (status) {
      case EmailStatus.SENT:
        return 'Отправлено';
      case EmailStatus.FAILED:
        return 'Ошибка';
      case EmailStatus.PENDING:
        return 'В ожидании';
      default:
        return status;
    }
  };

  // Определение колонок таблицы
  const columns: ColumnDef<EmailLog>[] = [
    {
      accessorKey: 'to',
      header: 'Получатель',
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.to}</div>;
      }
    },
    {
      accessorKey: 'subject',
      header: 'Тема',
      cell: ({ row }) => {
        return <div className="max-w-md truncate" title={row.original.subject}>{row.original.subject}</div>;
      }
    },
    {
      accessorKey: 'type',
      header: 'Тип',
      cell: ({ row }) => {
        return (
          <Badge variant="outline">
            {getEmailTypeLabel(row.original.type)}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        return (
          <Badge variant={getStatusVariant(row.original.status)}>
            {getStatusLabel(row.original.status)}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'sentAt',
      header: 'Дата отправки',
      cell: ({ row }) => row.original.sentAt
        ? new Date(row.original.sentAt).toLocaleString('ru-RU')
        : '-',
    },
    {
      accessorKey: 'error',
      header: 'Ошибка',
      cell: ({ row }) => {
        return row.original.error ? (
          <div className="max-w-xs truncate text-red-600" title={row.original.error}>
            {row.original.error}
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        );
      }
    },
    {
      id: 'rental-link',
      header: 'Аренда',
      cell: ({ row }) => {
        const rental = row.original.rental;
        return rental ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/cell-rentals/${rental.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Аренда
          </Button>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    }
  ];

  return (
    <ProtectedPage pageName="emailLogs">
      <div className="min-h-full bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Всего отправок</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Успешно</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.byStatus?.SENT || 0}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">С ошибкой</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.byStatus?.FAILED || 0}
              </div>
            </div>
          </div>
        )}

        {/* Панель управления */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 px-4 pt-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <h1 className="text-xl font-semibold">История отправки email</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
            </div>
          </div>

          {/* Таблица */}
          <div className="overflow-hidden overflow-fix">
            <BaseTable
              data={data?.data || []}
              columns={columns}
              searchColumn="to"
              searchPlaceholder="Поиск по email получателя..."
              tableId="email-logs-table"
              totalCount={data?.meta?.totalCount || 0}
              pageCount={data?.meta?.totalPages || 1}
              onPaginationChange={tableControls.handlePaginationChange}
              onSortingChange={tableControls.handleSortingChange}
              onSearchChange={tableControls.handleSearchChange}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
              sortableFields={EmailLogSortField}
              pagination={tableControls.pagination}
              sorting={tableControls.sorting}
              persistSettings={true}
              disableActions={true}  
            />
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}