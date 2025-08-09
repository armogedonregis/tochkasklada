'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetRequestsQuery, usePublicCreateRequestMutation, useGetRequestsStatsQuery, useDeleteRequestMutation } from '@/services/requestsService/requestsApi';
import { RequestItem, RequestFilters, RequestSortField, RequestStatus } from '@/services/requestsService/requests.types';
import { useTableControls } from '@/hooks/useTableControls';
import { ColumnDef } from '@tanstack/react-table';
import { ToastService } from '@/components/toast/ToastService';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Eye, Plus, FileText, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<RequestStatus>(RequestStatus.WAITING);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);

  const tableControls = useTableControls<RequestSortField>({
    defaultPageSize: 10,
    searchDebounceMs: 300,
  });
  
  const requestFilters: RequestFilters = {
    ...tableControls.queryParams,
    status: activeTab,
  };
  
  const { data, error, isLoading, refetch } = useGetRequestsQuery(requestFilters);
  const { data: statsData } = useGetRequestsStatsQuery();
  const [publicCreateRequest] = usePublicCreateRequestMutation();
  const [deleteRequest] = useDeleteRequestMutation();

  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.')) {
      return;
    }

    try {
      await deleteRequest(id).unwrap();
      ToastService.success('Заявка успешно удалена');
      refetch();
    } catch (error) {
      ToastService.error('Ошибка при удалении заявки');
    }
  };
  
  const requests = data?.data || [];
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;

  // Определение колонок таблицы
  const columns: ColumnDef<RequestItem>[] = [
    {
      accessorKey: 'name',
      header: 'Имя',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Телефон',
      cell: ({ row }) => row.original.phone || '-',
    },
    {
      id: 'sizeform',
      header: 'Размер',
      cell: ({ row }) => row.original.sizeform || '-',
    },
    {
      id: 'location',
      header: 'Локация',
      cell: ({ row }) => row.original.location || '-',
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => (
        <Badge variant={row.original.status === RequestStatus.WAITING ? 'default' : 'secondary'}>
          {row.original.status === RequestStatus.WAITING ? 'Ожидает' : 'Закрыта'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
      },
    },
    {
      accessorKey: 'closedAt',
      header: 'Дата закрытия',
      cell: ({ row }) => {
        if (!row.original.closedAt) return '-';
        const date = new Date(row.original.closedAt);
        return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
      },
    },
    {
      accessorKey: 'closedBy',
      header: 'Закрыл',
      cell: ({ row }) => row.original.closedBy?.user?.email || '-',
    },
    {
      accessorKey: 'comment',
      header: 'Комментарий',
      cell: ({ row }) => row.original.comment || '-',
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/requests/${row.original.id}`)}
            className="h-8 w-8 p-0"
            title="Просмотр заявки"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isSuperAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteRequest(row.original.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Удалить заявку"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const waitingCount = statsData?.byStatus?.WAITING || 0;
  const closedCount = statsData?.byStatus?.CLOSED || 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Заявки</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Управление входящими заявками от клиентов
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await publicCreateRequest({
                  email: `test_${Date.now()}@example.com`,
                  name: 'Тестовая заявка',
                  phone: '+79990000000',
                  sizeform: '7 м²',
                  location: 'Кудрово',
                  comment: 'Создано с кнопки для теста',
                }).unwrap();
                ToastService.success('Тестовая заявка создана');
                refetch();
              } catch (e) {
                ToastService.error('Не удалось создать тестовую заявку');
              }
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Создать тестовую заявку
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидающие</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{waitingCount}</div>
            <p className="text-xs text-muted-foreground">
              заявок требуют обработки
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Закрытые</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{closedCount}</div>
            <p className="text-xs text-muted-foreground">
              заявок обработано
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{waitingCount + closedCount}</div>
            <p className="text-xs text-muted-foreground">
              заявок в системе
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RequestStatus)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={RequestStatus.WAITING} className="relative">
                Ожидающие
                {waitingCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-[1.25rem] text-xs">
                    {waitingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value={RequestStatus.CLOSED} className="relative">
                Закрытые
                {closedCount > 0 && (
                  <Badge variant="outline" className="ml-2 h-5 min-w-[1.25rem] text-xs">
                    {closedCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={RequestStatus.WAITING} className="mt-4">
              <BaseTable
                data={requests}
                columns={columns}
                searchColumn="name"
                searchPlaceholder="Поиск по имени, email или телефону..."
                tableId="requests-waiting"
                totalCount={totalCount}
                pageCount={pageCount}
                onPaginationChange={tableControls.handlePaginationChange}
                onSortingChange={tableControls.handleSortingChange}
                onSearchChange={tableControls.handleSearchChange}
                isLoading={isLoading}
                error={error}
                onRetry={refetch}
                sortableFields={RequestSortField}
                pagination={tableControls.pagination}
                sorting={tableControls.sorting}
                persistSettings={true}
              />
            </TabsContent>

            <TabsContent value={RequestStatus.CLOSED} className="mt-4">
              <BaseTable
                data={requests}
                columns={columns}
                searchColumn="name"
                searchPlaceholder="Поиск по имени, email или телефону..."
                tableId="requests-closed"
                totalCount={totalCount}
                pageCount={pageCount}
                onPaginationChange={tableControls.handlePaginationChange}
                onSortingChange={tableControls.handleSortingChange}
                onSearchChange={tableControls.handleSearchChange}
                isLoading={isLoading}
                error={error}
                onRetry={refetch}
                sortableFields={RequestSortField}
                pagination={tableControls.pagination}
                sorting={tableControls.sorting}
                persistSettings={true}
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
