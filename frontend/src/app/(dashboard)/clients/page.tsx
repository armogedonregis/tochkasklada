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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Схема валидации для клиента
const clientValidationSchema = yup.object({
  name: yup.string().required('ФИО обязательно'),
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  phones: yup
    .array()
    .of(
      yup.object({
        phone: yup
          .string()
          .matches(/^\+7\d{10}$/, 'Телефон должен быть в формате +7XXXXXXXXXX')
          .required('Телефон обязателен'),
        comment: yup.string().optional()
      })
    )
    .min(1, 'Введите хотя бы один номер телефона'),
  isActive: yup.boolean()
});

// Типы для формы
interface ClientFormFields {
  name: string;
  email: string;
  phones: { phone: string; comment?: string }[];
  isActive: boolean;
}

export default function ClientsPage() {
  const router = useRouter();
  
  // Состояние для фильтра активности
  const [activeFilter, setActiveFilter] = useState<string>('all');

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
    sortDirection: tableControls.queryParams.sortDirection,
    isActive: activeFilter === 'all' ? undefined : activeFilter === 'active'
  });

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
          phones: values.phones,
          isActive: values.isActive
        }).unwrap();
        toast.success('Клиент успешно обновлен');
      } else {
        await createClient({
          name: values.name,
          email: values.email,
          phones: values.phones,
          isActive: values.isActive
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

  // Обработчик изменения статуса активности
  const handleActiveChange = async (client: Client, newValue: boolean) => {
    try {
      await updateClient({ 
        id: client.id,
        isActive: newValue
      }).unwrap();
      toast.success('Статус клиента обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении статуса клиента');
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
        return (
          <div>
            {Array.isArray(phones) ? phones.map((p: any) => (
              <div key={p.id} className="text-sm">
                <span>{p.phone}</span>
                {p.comment && <span className="text-gray-500 ml-1">({p.comment})</span>}
              </div>
            )) : ''}
          </div>
        );
      }
    },
    {
      id: 'isActive',
      header: 'Активен',
      cell: ({ row }) => {
        return (
          <Switch
            checked={row.original.isActive}
            onCheckedChange={(checked) => handleActiveChange(row.original, checked)}
          />
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата регистрации',
      cell: ({ row }) => row.original.createdAt 
        ? new Date(row.original.createdAt).toLocaleDateString('ru-RU') 
        : '-',
    },
    {
      id: 'details-link',
      header: 'Детали',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="icon"
          title="Подробнее о клиенте"
          onClick={() => router.push(`/clients/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
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
    },
    {
      type: 'checkbox' as const,
      fieldName: 'isActive' as const,
      label: 'Активный клиент'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Панель добавления и фильтрации */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => modal.openCreate()}>
            Добавить клиента
          </Button>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все клиенты</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Таблица */}
      <div className="">
        <BaseTable
          data={data?.data || []}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Поиск по имени клиента..."
          onEdit={modal.openEdit}
          onDelete={handleDelete}
          tableId="clients-table"
          totalCount={data?.meta?.totalCount || 0}
          pageCount={data?.meta?.totalPages || 1}
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
          phones: Array.isArray(modal.editItem.phones) ? modal.editItem.phones.map((p: any) => ({ 
            phone: p.phone, 
            comment: p.comment || '' 
          })) : [],
          isActive: modal.editItem.isActive
        } : {
          name: '',
          email: '',
          phones: [],
          isActive: false
        }}
      />
    </div>
  );
} 