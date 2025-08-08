'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetListsQuery, useDeleteListMutation } from '@/services/listService/listApi';
import { useGetLocationsQuery } from '@/services/locationsService/locationsApi';
import { List, ListFilters, ListSortField } from '@/services/listService/list.types';
import { useTableControls } from '@/hooks/useTableControls';
import { ColumnDef } from '@tanstack/react-table';
import { ToastService } from '@/components/toast/ToastService';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Eye, MapPin, List as ListIcon, Users, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export default function ListPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);

  const tableControls = useTableControls<ListSortField>({
    defaultPageSize: 10,
    searchDebounceMs: 300
  });
  
  const listFilters: ListFilters = {
    ...tableControls.queryParams,
    locationId: selectedLocationId && selectedLocationId !== 'all' ? selectedLocationId : undefined,
  };
  
  const { data, error, isLoading, refetch } = useGetListsQuery(listFilters);
  const { data: locations } = useGetLocationsQuery();
  const [deleteList] = useDeleteListMutation();

  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const handleDeleteList = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.')) {
      return;
    }

    try {
      await deleteList(id).unwrap();
      ToastService.success('Запись успешно удалена');
      refetch();
    } catch (error) {
      ToastService.error('Ошибка при удалении записи');
    }
  };
  
  const lists = data?.data || [];
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;

  // Определение колонок таблицы
  const columns: ColumnDef<List>[] = [
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
      accessorKey: 'location',
      header: 'Локация',
      cell: ({ row }) => {
        const location = row.original.location;
        return location ? (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{location.name}</span>
          </div>
        ) : '-';
      },
    },
    {
      accessorKey: 'description',
      header: 'Описание',
      cell: ({ row }) => row.original.description || '-',
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
      cell: ({ row }) => row.original.closedBy?.email || '-',
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
            onClick={() => router.push(`/list/${row.original.id}`)}
            className="h-8 w-8 p-0"
            title="Просмотр записи"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isSuperAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteList(row.original.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Удалить запись"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Лист ожидания</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Управление очередью клиентов, ожидающих свободные ячейки
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              записей в листе ожидания
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">По локации</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lists.length}</div>
            <p className="text-xs text-muted-foreground">
              {selectedLocationId === 'all' ? 'все локации' : 'текущая локация'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Локация</label>
              <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Все локации" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все локации</SelectItem>
                  {locations?.data?.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {location.name} ({location.short_name})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Лист ожидания</CardTitle>
        </CardHeader>
        <CardContent>
          <BaseTable
            data={lists}
            columns={columns}
            searchColumn="name"
            searchPlaceholder="Поиск по имени, email или телефону..."
            tableId="waiting-lists-table"
            totalCount={totalCount}
            pageCount={pageCount}
            onPaginationChange={tableControls.handlePaginationChange}
            onSortingChange={tableControls.handleSortingChange}
            onSearchChange={tableControls.handleSearchChange}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            sortableFields={ListSortField}
            pagination={tableControls.pagination}
            sorting={tableControls.sorting}
            persistSettings={true}
          />
        </CardContent>
      </Card>
    </div>
  );
} 