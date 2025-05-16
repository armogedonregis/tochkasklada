"use client";

import { useState } from 'react';
import { 
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation 
} from '@/services/clientsApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { Client, ClientSortField } from '@/types/client.types';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';

// Схема валидации для клиента
const clientValidationSchema = yup.object({
  name: yup.string().required('ФИО обязательно'),
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  phones: yup.string()
    .required('Введите хотя бы один номер телефона')
    .test(
      'has-valid-phones',
      'Введите номера в формате +7XXXXXXXXXX, разделенные запятыми',
      (value) => {
        if (!value) return false;
        const phones = value.split(',').map((p) => p.trim()).filter((p) => p.length > 0);
        return phones.length > 0;
      }
    )
});

// Типы для формы
interface ClientFormFields {
  name: string;
  email: string;
  phones: string; // Телефоны будут храниться как строка с разделителем
}

export default function ClientsPage() {
  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<ClientSortField>({
    defaultPageSize: 10,
    searchDebounceMs: 300
  });
  
  // Получение данных о клиентах с учетом параметров
  const { data, error, isLoading, refetch } = useGetClientsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    search: tableControls.queryParams.search,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection
  });
  
  // Данные клиентов из пагинированного ответа
  const clients = data?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;

  // Мутации для операций с клиентами
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  // Функция для преобразования строки телефонов в массив
  const phonesToArray = (phoneStr: string): string[] => {
    return phoneStr.split(',').map((p) => p.trim()).filter((p) => p.length > 0);
  };

  // Функция для преобразования массива телефонов в строку
  const phonesToString = (phones: any[]): string => {
    return phones
      ? phones.map((p) => typeof p === 'object' ? p.phone || p.number : p).join(', ')
      : '';
  };

  // Хук для управления модальным окном
  const modal = useFormModal<ClientFormFields, Client>({
    onSubmit: async (values) => {
      const phones = phonesToArray(values.phones);
      
      if (modal.editItem) {
        await updateClient({ 
          id: modal.editItem.id,
          name: values.name,
          email: values.email,
          phones: phones
        }).unwrap();
        toast.success('Клиент успешно обновлен');
      } else {
        await createClient({
          name: values.name,
          email: values.email,
          phones: phones
        }).unwrap();
        toast.success('Клиент успешно создан');
      }
    },
    onError: () => {
      toast.error('Ошибка при сохранении клиента');
    }
  });

  // Обработчик удаления
  const handleDelete = async (client: Client) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      try {
        await deleteClient(client.id).unwrap();
        toast.success('Клиент успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении клиента');
      }
    }
  };

  // Определение колонок таблицы
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'ФИО',
      cell: ({ row }) => {
        return <div>{row.original.name}</div>;
      }
    },
    {
      id: 'email',
      header: 'Email',
      accessorFn: (row) => row.user?.email || '',
      cell: ({ row }) => {
        return <div>{row.original.user?.email || ''}</div>;
      }
    },
    {
      id: 'phones',
      header: 'Телефоны',
      cell: ({ row }) => {
        const phones = row.original.phones;
        return <div>{phonesToString(phones)}</div>;
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата регистрации',
      cell: ({ row }) => row.original.createdAt 
        ? new Date(row.original.createdAt).toLocaleDateString('ru-RU') 
        : '-',
    }
  ];

  // Поля формы для модального окна
  const modalFields = [
    {
      type: 'input' as const,
      fieldName: 'name' as const,
      label: 'ФИО',
      placeholder: 'Иванов Иван Иванович'
    },
    {
      type: 'input' as const,
      fieldName: 'email' as const,
      label: 'Email',
      placeholder: 'email@example.com'
    },
    {
      type: 'input' as const,
      fieldName: 'phones' as const,
      label: 'Телефоны',
      placeholder: '+79001234567, +79001234568'
    }
  ];

  return (
    <>
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={modal.openCreate}>
          Добавить клиента
        </Button>
      </div>

      {/* Таблица */}
      <div className="rounded-md border">
        <BaseTable
          data={clients}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Поиск по имени клиента..."
          onEdit={modal.openEdit}
          onDelete={handleDelete}
          tableId="clients-table"
          totalCount={totalCount}
          pageCount={pageCount}
          onPaginationChange={tableControls.handlePaginationChange}
          onSortingChange={tableControls.handleSortingChange}
          onSearchChange={tableControls.handleSearchChange}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          sortableFields={ClientSortField}
          pagination={tableControls.pagination}
          sorting={tableControls.sorting}
          persistSettings={true}
        />
      </div>

      {/* Модальное окно */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать клиента' : 'Добавить клиента'}
        fields={modalFields}
        validationSchema={clientValidationSchema}
        onSubmit={modal.handleSubmit}
        submitText={modal.editItem ? 'Сохранить' : 'Добавить'}
        defaultValues={modal.editItem ? {
          name: modal.editItem.name,
          email: modal.editItem.user?.email || '',
          phones: phonesToString(modal.editItem.phones || [])
        } : {
          name: '',
          email: '',
          phones: ''
        }}
      />
    </>
  );
} 