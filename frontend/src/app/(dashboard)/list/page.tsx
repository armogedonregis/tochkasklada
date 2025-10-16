'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetListsQuery, useDeleteListMutation, useCreateListMutation } from '@/services/listService/listApi';
import { useGetLocationsQuery } from '@/services/locationsService/locationsApi';
import { CreateListDto, List, ListFilters, ListSortField, ListStatus } from '@/services/listService/list.types';
import { useTableControls } from '@/hooks/useTableControls';
import { ColumnDef } from '@tanstack/react-table';
import { ToastService } from '@/components/toast/ToastService';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import * as yup from 'yup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Eye, MapPin, Users, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useFormModal } from '@/hooks/useFormModal';
import { toast } from 'react-toastify';
import { useGetSizesQuery } from '@/services/sizesService/sizesApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ListPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<ListStatus>(ListStatus.WAITING);
  const [selectedSizeId, setSelectedSizeId] = useState<string>('all');
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);

  const tableControls = useTableControls<ListSortField>({
    defaultPageSize: 10,
    searchDebounceMs: 300
  });

  const listFilters: ListFilters = {
    ...tableControls.queryParams,
    status: activeTab,
    locationId: selectedLocationId && selectedLocationId !== 'all' ? selectedLocationId : undefined,
    sizeId: selectedSizeId && selectedSizeId !== 'all' ? selectedSizeId : undefined,
  };

  const { data, error, isLoading, refetch } = useGetListsQuery(listFilters);
  const { data: locations } = useGetLocationsQuery();
  const { data: sizes = [] } = useGetSizesQuery();
  const [deleteList] = useDeleteListMutation();
  const [createList] = useCreateListMutation();

  const isSuperAdmin = user?.role === 'SUPERADMIN';


  // Хук для управления модальным окном
  const modal = useFormModal<CreateListDto, List>({
    onSubmit: async (values) => {
      const normalize = (s?: string) => {
        const v = typeof s === 'string' ? s.trim() : s;
        return v && v.length > 0 ? v : undefined;
      };

      await createList({
        name: values.name.trim(),
        email: normalize(values.email) as string | undefined,
        phone: normalize(values.phone) as string | undefined,
        description: normalize(values.description) as string | undefined,
        locationId: normalize(values.locationId) as string | undefined,
        sizeId: normalize((values as any).sizeId) as string | undefined,
      }).unwrap();
      toast.success('Запись успешно создана');
    },
    onError: () => {
      toast.error('Ошибка при сохранении записи');
    }
  });

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

  const createListSchema = yup.object({
    name: yup.string().required('Имя обязательно'),
    email: yup.string().email('Некорректный email').optional(),
    phone: yup.string()
      .matches(/^\+7\d{10}$/, 'Телефон должен быть в формате +7XXXXXXXXXX')
      .required('Телефон обязателен'),
    description: yup.string().optional(),
    locationId: yup.string().optional(),
    sizeId: yup.string().optional(),
  });

  const createFields = [
    { type: 'input' as const, fieldName: 'name' as const, label: 'Имя', placeholder: 'ФИО' },
    { type: 'input' as const, fieldName: 'email' as const, label: 'Email', placeholder: 'user@example.com' },
    { type: 'phoneInput' as const, fieldName: 'phone' as const, label: 'Телефон', placeholder: '+7...', multiplePhones: false },
    {
      type: 'select' as const,
      fieldName: 'locationId' as const,
      label: 'Локация',
      placeholder: 'Выберите локацию (необязательно)',
      options: (locations?.data || []).map((loc) => ({
        label: `${loc.name} (${loc.short_name})`,
        value: loc.id,
      })),
    },
    {
      type: 'select' as const,
      fieldName: 'sizeId' as const,
      label: 'Размер',
      placeholder: 'Выберите размер (необязательно)',
      options: (sizes || []).map((s: any) => ({
        label: `${s.name} (${s.short_name})`,
        value: s.id,
      })),
    },
    { type: 'input' as const, fieldName: 'description' as const, label: 'Описание', placeholder: 'Кратко о запросе' },
  ];

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
      id: 'size',
      header: 'Размер',
      cell: ({ row }) => row.original.size ? `${row.original.size.name}` : '-',
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
        <Button onClick={() => modal.openCreate()}>
          Добавить в лист ожидания
        </Button>
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
            <div className="flex-1">
              <label className="text-sm font-medium">Размер</label>
              <Select value={selectedSizeId} onValueChange={setSelectedSizeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Все размеры" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все размеры</SelectItem>
                  {(sizes || []).map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.short_name})
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ListStatus)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={ListStatus.WAITING} className="relative">
              Ожидающие
            </TabsTrigger>
            <TabsTrigger value={ListStatus.CLOSED} className="relative">
              Закрытые
            </TabsTrigger>
          </TabsList>

          <TabsContent value={ListStatus.WAITING} className="mt-4">

            <CardContent>
              <BaseTable
                data={lists}
                columns={columns}
                searchColumn="name"
                searchPlaceholder="Поиск по имени, email или телефону..."
                tableId="waiting-lists-table"
                editPermission="lists:update"
                deletePermission="lists:delete"
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
          </TabsContent>
          <TabsContent value={ListStatus.CLOSED} className="mt-4">

            <CardContent>
              <BaseTable
                data={lists}
                columns={columns}
                searchColumn="name"
                searchPlaceholder="Поиск по имени, email или телефону..."
                tableId="closed-lists-table"
                editPermission="lists:update"
                deletePermission="lists:delete"
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
          </TabsContent>
        </Tabs>
      </Card>

      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title="Добавить в лист ожидания"
        fields={createFields}
        validationSchema={createListSchema}
        onSubmit={modal.handleSubmit}
        submitText="Добавить"
        defaultValues={{ name: '', email: '', phone: '', description: '', locationId: '', sizeId: '' } as any}
      />
    </div>
  );
} 