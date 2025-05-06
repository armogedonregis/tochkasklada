"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  useGetClientsQuery,
  useDeleteClientMutation,
  useCreateClientMutation,
  useUpdateClientMutation,
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  Phone
} from "@/services/clientsApi";
import { BaseTable } from "@/components/table/BaseTable";
import { ClientModal } from "@/components/modals/ClientModal";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  normalizePhones,
  phonesToFormattedString,
  phonesToStringArray,
  formatPhoneForSaving,
  parsePhonesString
} from "@/lib/phoneUtils";
import { TableActions } from "@/components/table/TableActions";

// Схема валидации для клиента
const clientValidationSchema = yup.object({
  name: yup.string().required("ФИО обязательно"),
  email: yup.string().email("Введите корректный email").required("Email обязателен"),
  phones: yup.string()
    .required("Введите хотя бы один номер телефона")
    .test(
      'has-valid-phones',
      'Введите номера в формате +7XXXXXXXXXX, разделенные запятыми',
      (value) => {
        if (!value) return false;
        const phones = value.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 0);
        return phones.length > 0;
      }
    )
});

// Типы для формы
type ClientFormValues = {
  name: string;
  email: string;
  phones: string; // Телефоны будут храниться как строка с разделителем
};

// Начальные значения для формы создания
const initialFormValues: ClientFormValues = {
  name: "",
  email: "",
  phones: ""
};

// Создание пустого клиента для добавления в таблицу
const createEmptyClient = (): Client => ({
  id: `temp-${Date.now()}`, // Временный ID
  userId: "",
  name: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  phones: [],
  user: {
    id: '',
    email: '',
    role: 'CLIENT'
  }
});

// Функция для преобразования строки телефонов в массив
const parsePhoneString = (phoneStr: string): string[] => {
  return phoneStr.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 0);
};

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading, refetch } = useGetClientsQuery();
  const [deleteClient] = useDeleteClientMutation();
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();

  // Определение колонок таблицы
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'ФИО',
      cell: ({ getValue }) => <div>{String(getValue())}</div>,
    },
    {
      id: 'email',
      header: 'Email',
      accessorFn: (row) => row.user?.email || '',
      cell: ({ getValue }) => <div>{String(getValue())}</div>,
    },
    {
      id: 'phones',
      header: 'Телефоны',
      accessorFn: (row) => phonesToFormattedString(row.phones), // Используем функцию форматирования для отображения
      cell: ({ getValue }) => <div>{String(getValue())}</div>,
    },
  ];

  // Обработчики действий
  const handleAddRow = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  // Открыть модальное окно для создания клиента
  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  // Открыть модальное окно для редактирования клиента
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  // Закрыть модальное окно
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  // Сохранить данные из модального окна
  const handleSaveFromModal = async (formData: any) => {
    try {
      // Проверяем, редактируем существующего или создаем нового клиента
      if (editingClient) {
        // Формируем данные для обновления
        const updateData: UpdateClientRequest = {
          id: editingClient.id,
          name: formData.name,
          email: formData.email,
          phones: phonesToStringArray(formData.phones) // Используем утилиту
        };

        // Обновляем клиента на сервере
        await updateClient(updateData).unwrap();
      } else {
        // Формируем данные для создания
        const createData: CreateClientRequest = {
          name: formData.name,
          email: formData.email,
          phones: phonesToStringArray(formData.phones) // Используем утилиту
        };

        // Создаем клиента на сервере
        await createClient(createData).unwrap();
      }

      // Закрываем модальное окно и обновляем список клиентов
      setIsModalOpen(false);
      setEditingClient(null);
      toast.success(`Клиент успешно ${editingClient ? 'обновлен' : 'создан'}`);
    } catch (error: any) {
      console.error('Ошибка при сохранении клиента:', error);
      toast.error(`Ошибка при ${editingClient ? 'обновлении' : 'создании'} клиента: ${error.data?.message || error.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleDelete = async (id: string) => {
    // Если ID начинается с temp-, это новая несохраненная запись
    if (id.startsWith('temp-')) {
      setEditingClient(null);
      return;
    }

    if (confirm("Вы уверены, что хотите удалить этого клиента?")) {
      try {
        await deleteClient(id).unwrap();
        toast.success("Клиент успешно удален");
      } catch (error) {
        console.error("Failed to delete client:", error);
        toast.error("Ошибка при удалении клиента");
      }
    }
  };

  // Состояния загрузки и ошибки
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление клиентами</h1>

        <div className="flex items-center gap-4">
          <Button onClick={handleOpenCreateModal}>
            <UserPlus className="h-4 w-4 mr-1" />
            Новый клиент
          </Button>
        </div>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-8 text-center">
          <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">Нет данных о клиентах</p>
          <Button onClick={handleOpenCreateModal}>
            <UserPlus className="h-4 w-4 mr-1" />
            Добавить первого клиента
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <BaseTable
            data={clients}
            columns={columns}
            searchColumn="name"
            searchPlaceholder="Поиск по имени..."
            pageSize={10}
            className="border-collapse"
            enableColumnReordering={true}
            persistColumnOrder={true}
            tableId="clients-table"
            enableActions={true}
            onEdit={handleEdit}
            onDelete={(client) => handleDelete(client.id)}
          />
        </div>
      )}

      {/* Модальное окно для создания/редактирования клиента */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFromModal}
        client={editingClient}
        title={editingClient ? 'Редактировать клиента' : 'Новый клиент'}
      />
    </div>
  );
} 