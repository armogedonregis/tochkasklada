"use client";

import { useState } from 'react';
import { 
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation 
} from '@/services/clientsService/clientsApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { Client, ClientSortField } from '@/services/clientsService/clients.types';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useTableControls } from '@/hooks/useTableControls';
import { useFormModal } from '@/hooks/useFormModal';

// Схема валидации для клиента
const clientValidationSchema = yup.object({
  name: yup.string().required('ФИО обязательно'),
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  phones: yup
    .array()
    .of(
      yup
        .string()
        .matches(/^\+7\d{10}$/, 'Телефон должен быть в формате +7XXXXXXXXXX')
    )
    .min(1, 'Введите хотя бы один номер телефона')
});

// Типы для формы
interface ClientFormFields {
  name: string;
  email: string;
  phones: string[]; // Телефоны теперь массив
}

export default function ClientsPage() {
  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls<ClientSortField>({
    defaultPageSize: 10,
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

  // Хук для управления модальным окном
  const modal = useFormModal<ClientFormFields, Client>({
    onSubmit: async (values) => {
      if (modal.editItem) {
        await updateClient({ 
          id: modal.editItem.id,
          name: values.name,
          email: values.email,
          phones: values.phones
        }).unwrap();
        toast.success('Клиент успешно обновлен');
      } else {
        await createClient({
          name: values.name,
          email: values.email,
          phones: values.phones
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
        return <div>{Array.isArray(phones) ? phones.map((p: any) => p.phone).join(', ') : ''}</div>;
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
      type: 'phoneInput' as const,
      fieldName: 'phones' as const,
      label: 'Телефоны',
      multiplePhones: true
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Панель добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Button onClick={() => modal.openCreate()}>
          Добавить клиента
        </Button>
      </div>

      {/* Таблица */}
      <div className="">
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
          phones: Array.isArray(modal.editItem.phones) ? modal.editItem.phones.map((p: any) => p.phone) : []
        } : {
          name: '',
          email: '',
          phones: []
        }}
      />
    </div>
  );
} 