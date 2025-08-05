'use client';

import { useState, MouseEvent } from 'react';
import { useGetListsQuery, useCloseListMutation, useDeleteListMutation } from '@/services/listService/listApi';
import { List, ListFilters, ListSortField, ListStatus } from '@/services/listService/list.types';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { ColumnDef } from '@tanstack/react-table';
import * as yup from 'yup';
import { ToastService } from '@/components/toast/ToastService';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Схема валидации для закрытия заявки
const closeListValidationSchema = yup.object({
  comment: yup.string().required('Комментарий обязателен')
});

export default function ListPage() {
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState<ListStatus>(ListStatus.WAITING);

  // ====== ХУКИ ДЛЯ ДАННЫХ И ТАБЛИЦЫ ======
  const tableControls = useTableControls<ListSortField>({
    defaultPageSize: 10,
    searchDebounceMs: 300
  });
  
  // Преобразуем параметры запроса из useTableControls в формат для listApi
  const listFilters: ListFilters = {
    ...tableControls.queryParams,
    status: activeTab // Добавляем фильтр по статусу в зависимости от активной вкладки
  };
  
  const { data, error, isLoading, refetch } = useGetListsQuery(listFilters);
  
  // Данные заявок теперь находятся в свойстве data пагинированного ответа
  const lists = data?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;
  
  // Мутации для операций с заявками
  const [closeList] = useCloseListMutation();
  const [deleteList] = useDeleteListMutation();

  // ====== ХУКИ ДЛЯ МОДАЛЬНЫХ ОКОН ======
  const deleteModal = useDeleteModal();

  const closeModal = useFormModal<{ comment: string }, List>({
    itemToFormData: () => ({ comment: '' }),
    onSubmit: async (values) => {
      try {
        if (closeModal.editItem) {
          await closeList({ 
            id: closeModal.editItem.id,
            data: { comment: values.comment }
          }).unwrap();
          ToastService.success('Заявка успешно закрыта');
        }
      } catch (error) {
        ToastService.error('Ошибка при закрытии заявки');
      }
    }
  });

  // ====== ОБРАБОТЧИКИ СОБЫТИЙ ======
  const handleClose = (list: List) => {
    closeModal.openEdit(list);
  };

  const handleDelete = async (list: List) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        await deleteList(list.id).unwrap();
        ToastService.success('Заявка успешно удалена');
      } catch (error) {
        ToastService.error('Ошибка при удалении заявки');
      }
    }
  };

  // ====== ОПРЕДЕЛЕНИЯ UI КОМПОНЕНТОВ ======
  // Поля формы для модального окна закрытия
  const closeModalFields = [
    {
      type: 'input' as const,
      fieldName: 'comment' as const,
      label: 'Причина закрытия',
      placeholder: 'Укажите причину закрытия заявки...'
    }
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
      accessorKey: 'source',
      header: 'Источник',
      cell: ({ row }) => {
        const source = row.original.source;
        return source.replace('Tilda-', '');
      },
    },
    {
      accessorKey: 'description',
      header: 'Описание',
      cell: ({ row }) => row.original.description || '-',
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'WAITING' ? 'default' : 'secondary'}>
            {status === 'WAITING' ? 'Ожидает' : 'Закрыта'}
          </Badge>
        );
      },
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
  ];

  // ====== РЕНДЕР СТРАНИЦЫ ======
  return (
    <>
      {/* Заголовок страницы */}
      <div className="flex justify-between items-center mb-6 px-4 pt-4">
        <h1 className="text-2xl font-bold">Лист ожидания</h1>
      </div>

      {/* Вкладки */}
      <div className="px-4 mb-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ListStatus)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={ListStatus.WAITING}>
              Ожидающие ({activeTab === ListStatus.WAITING ? totalCount : '...'})
            </TabsTrigger>
            <TabsTrigger value={ListStatus.CLOSED}>
              Закрытые ({activeTab === ListStatus.CLOSED ? totalCount : '...'})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={ListStatus.WAITING} className="mt-4">
            {/* Таблица ожидающих заявок */}
            <div className="rounded-md border">
              <BaseTable
                data={lists}
                columns={columns}
                searchColumn="name"
                searchPlaceholder="Поиск по имени, email или телефону..."
                onEdit={handleClose}
                onDelete={handleDelete}
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
            </div>
          </TabsContent>
          
          <TabsContent value={ListStatus.CLOSED} className="mt-4">
            {/* Таблица закрытых заявок */}
            <div className="rounded-md border">
              <BaseTable
                data={lists}
                columns={columns}
                searchColumn="name"
                searchPlaceholder="Поиск по имени, email или телефону..."
                onDelete={handleDelete}
                tableId="closed-lists-table"
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальное окно закрытия заявки */}
      <BaseFormModal
        isOpen={closeModal.isOpen}
        onClose={closeModal.closeModal}
        title="Закрыть заявку"
        fields={closeModalFields}
        validationSchema={closeListValidationSchema}
        onSubmit={closeModal.handleSubmit}
        submitText="Закрыть"
        formData={closeModal.formData}
        isLoading={false}
        defaultValues={closeModal.editItem ? { comment: '' } : undefined}
      />
    </>
  );
} 