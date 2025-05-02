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
import { EditableTable, EditableCell } from "@/components/table/EditableTable";
import { ClientModal } from "@/components/modals/ClientModal";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2, UserPlus, Edit } from "lucide-react";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  normalizePhones,
  phonesToFormattedString,
  phonesToStringArray,
  formatPhoneForSaving,
  parsePhonesString
} from "@/lib/phoneUtils";

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
  const [editedData, setEditedData] = useState<Client[]>([]);
  const [autoSave, setAutoSave] = useState<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: clients = [], isLoading, refetch } = useGetClientsQuery();
  const [deleteClient] = useDeleteClientMutation();
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();

  // Обновляем editedData при изменении clients
  useEffect(() => {
    if (clients && clients.length > 0) {
      // Преобразуем телефоны к нужному формату для отображения
      const formattedClients = clients.map(client => {
        // Используем утилиту для нормализации телефонов
        const phones = normalizePhones(client.phones);

        return {
          ...client,
          phones
        };
      });

      setEditedData(formattedClients);
    }
  }, [clients]);

  // Определение колонок таблицы с редактируемыми ячейками
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'ФИО',
      cell: (props) => <EditableCell {...props} />,
    },
    {
      id: 'email',
      header: 'Email',
      accessorFn: (row) => row.user?.email || '',
      cell: (props) => <EditableCell {...props} />,
    },
    {
      id: 'phones',
      header: 'Телефоны',
      accessorFn: (row) => phonesToFormattedString(row.phones), // Используем функцию форматирования для отображения
      cell: (props) => <EditableCell {...props} />,
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2 p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
            title="Редактировать клиента"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            title="Удалить клиента"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Обработчики действий
  const handleAddRow = () => {
    setEditedData((prev) => {
      const newData = [...prev];
      newData.push(createEmptyClient());
      return newData;
    });
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
      refetch();
    } catch (error: any) {
      console.error('Ошибка при сохранении клиента:', error);
      toast.error(`Ошибка при ${editingClient ? 'обновлении' : 'создании'} клиента: ${error.data?.message || error.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleDelete = async (id: string) => {
    // Если ID начинается с temp-, это новая несохраненная запись
    if (id.startsWith('temp-')) {
      setEditedData((prev) => prev.filter(client => client.id !== id));
      return;
    }

    if (confirm("Вы уверены, что хотите удалить этого клиента?")) {
      try {
        await deleteClient(id).unwrap();
        toast.success("Клиент успешно удален");
        await refetch(); // Обновляем список после удаления
      } catch (error) {
        console.error("Failed to delete client:", error);
        toast.error("Ошибка при удалении клиента");
      }
    }
  };

  // Обработчик сохранения изменений из таблицы
  const handleSaveChanges = async (updatedData: Client[]) => {
    const promises = [];

    for (const client of updatedData) {
      // Если ID начинается с temp-, это новый клиент
      if (client.id.startsWith('temp-')) {
        // Получаем массив телефонов
        const phones = parsePhonesString(client.phones);
        const email = client.user?.email || '';

        if (client.name && email && phones.length > 0) {
          const newClient: CreateClientRequest = {
            name: client.name,
            email: email,
            phones: phones
          };

          promises.push(createClient(newClient).unwrap());
        }
      } else {
        // Обновляем существующего клиента
        const existingClient = clients.find(c => c.id === client.id);
        if (existingClient) {
          // Получаем существующие телефоны в нормализованном виде
          const existingPhones = parsePhonesString(existingClient.phones)
            .sort()
            .join(',');

          // Получаем текущие телефоны из формы
          const currentPhones = parsePhonesString(client.phones)
            .sort()
            .join(',');

          const existingEmail = existingClient.user?.email || '';
          const currentEmail = client.user?.email || '';

          // Проверяем, есть ли изменения
          if (existingClient.name !== client.name ||
            existingEmail !== currentEmail ||
            existingPhones !== currentPhones) {

            // Получаем массив телефонов для обновления
            const phones = parsePhonesString(client.phones);

            const updatedClient: UpdateClientRequest = {
              id: client.id,
              name: client.name,
              email: currentEmail,
              phones: phones
            };

            promises.push(updateClient(updatedClient).unwrap());
          }
        }
      }
    }

    if (promises.length > 0) {
      try {
        await Promise.all(promises);
        toast.success(`Изменения сохранены (${promises.length} ${promises.length === 1 ? 'запись' : 'записей'})`);
        await refetch();
      } catch (error) {
        console.error("Ошибка при сохранении изменений:", error);
        toast.error("Произошла ошибка при сохранении некоторых изменений");
      }
    } else {
      toast.info("Нет изменений для сохранения");
    }
  };

  // Обработчик импорта данных из Excel
  const handleImportData = (importedData: Partial<Client>[]) => {
    // Преобразуем импортированные данные в формат клиентов для отображения
    const newClients = importedData.map((importedClient) => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Обрабатываем телефоны по умолчанию как пустой массив
      let phoneArray: { id: string; number: string }[] = [];

      // Обрабатываем телефоны из импортированных данных
      if (importedClient.phones) {
        if (Array.isArray(importedClient.phones)) {
          // Если phones - массив телефонов Phone
          if (importedClient.phones.length > 0 && typeof importedClient.phones[0] === 'object') {
            phoneArray = importedClient.phones.map(p => {
              // Форматируем номер перед сохранением
              const phoneObj = typeof p === 'object' && p !== null
                ? {
                  id: (p as any).id || `temp-phone-${Math.random().toString(36).substr(2, 9)}`,
                  number: formatPhoneForSaving('number' in p ? (p as any).number : ('phone' in p ? (p as any).phone : String(p)))
                }
                : {
                  id: `temp-phone-${Math.random().toString(36).substr(2, 9)}`,
                  number: formatPhoneForSaving(String(p))
                };
              return phoneObj;
            });
          }
          // Если phones - массив строк
          else {
            phoneArray = (importedClient.phones as unknown as string[]).map(phone => ({
              id: `temp-phone-${Math.random().toString(36).substr(2, 9)}`,
              number: formatPhoneForSaving(phone)
            }));
          }
        }
        // Если телефоны импортированы как строка
        else if (typeof importedClient.phones === 'string') {
          const phoneStr = importedClient.phones as string;
          const phones = phoneStr.split(',').map(p => p.trim()).filter(p => p.length > 0);

          phoneArray = phones.map(phone => ({
            id: `temp-phone-${Math.random().toString(36).substr(2, 9)}`,
            number: formatPhoneForSaving(phone)
          }));
        }
      }

      // Получаем email из импортированных данных
      const email = (importedClient.user?.email) ||
        // Для обратной совместимости со старым форматом
        ((importedClient as any).email) || '';

      // Создаем новый объект клиента
      return {
        id: tempId,
        userId: "",
        name: importedClient.name || "",
        phones: phoneArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: '',
          email: email,
          role: 'CLIENT'
        }
      } as Client;
    });

    // Добавляем новых клиентов к существующим для редактирования
    setEditedData(prev => [...prev, ...newClients]);

    // Показываем уведомление
    toast.info(`Импортировано ${newClients.length} клиентов. Не забудьте сохранить изменения!`);
  };

  // Валидация ячеек таблицы
  const validateCell = (value: any, columnId: string, rowData: any): { isValid: boolean; errorMessage?: string } => {
    try {
      // Валидация имени
      if (columnId === 'name') {
        if (!value || value.trim().length === 0) {
          return { isValid: false, errorMessage: 'ФИО не может быть пустым' };
        }
        return { isValid: true };
      }

      // Валидация email
      if (columnId === 'email') {
        if (!value || value.trim().length === 0) {
          return { isValid: false, errorMessage: 'Email не может быть пустым' };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { isValid: false, errorMessage: 'Некорректный формат email' };
        }
        return { isValid: true };
      }

      // Валидация телефонов
      if (columnId === 'phones') {
        if (!value || value.trim().length === 0) {
          return { isValid: false, errorMessage: 'Введите хотя бы один номер телефона' };
        }

        // Используем parsePhonesString для форматирования и валидации
        const formattedPhones = parsePhonesString(value);

        if (formattedPhones.length === 0) {
          return { isValid: false, errorMessage: 'Введите хотя бы один номер телефона' };
        }

        // Проверка формата каждого телефона
        for (const phone of formattedPhones) {
          if (phone.length < 12) { // +7 + минимум 10 цифр
            return {
              isValid: false,
              errorMessage: 'Телефон должен содержать не менее 10 цифр'
            };
          }
        }

        return { isValid: true };
      }

      // Для всех остальных колонок считаем, что валидация проходит
      return { isValid: true };
    } catch (error) {
      console.error('Ошибка при валидации:', error);
      return { isValid: false, errorMessage: 'Ошибка валидации' };
    }
  };

  // Обработка изменения данных в таблице для автосохранения
  const handleDataChange = (updatedData: Client[]) => {
    // Сохраняем обновленные данные
    setEditedData(updatedData);

    // Если автосохранение выключено, просто обновляем данные
    if (!autoSave) return;

    // Очищаем предыдущий таймер при каждом вызове
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Иначе запускаем таймер для автосохранения через 2 секунды
    // после последнего изменения
    autoSaveTimerRef.current = setTimeout(() => {
      handleSaveChanges(updatedData);
    }, 2000);
  };

  // Переключатель автосохранения
  const toggleAutoSave = () => {
    setAutoSave(prev => !prev);

    // Показываем уведомление
    if (!autoSave) {
      toast.info('Автосохранение включено. Изменения будут сохраняться автоматически после 2 секунд бездействия.');
    } else {
      toast.info('Автосохранение выключено. Не забывайте сохранять изменения вручную.');
    }
  };

  // Состояния загрузки и ошибки
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl mb-2">Загрузка данных...</h3>
        <p className="text-gray-500">Пожалуйста, подождите</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление клиентами</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              checked={autoSave}
              onChange={toggleAutoSave}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="autoSave" className="text-sm">
              Автосохранение
            </label>
          </div>

          <Button onClick={handleOpenCreateModal}>
            <UserPlus className="h-4 w-4 mr-1" />
            Новый клиент
          </Button>
        </div>
      </div>

      {!clients || clients.length === 0 && editedData.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-lg mb-4">Нет данных о клиентах</p>
          <Button onClick={handleOpenCreateModal}>
            <UserPlus className="h-4 w-4 mr-1" />
            Добавить первого клиента
          </Button>
        </div>
      ) : (
        <EditableTable
          data={editedData.length > 0 ? editedData : clients}
          columns={columns}
          searchColumn="name"
          searchPlaceholder="Поиск по имени..."
          onRowAdd={handleAddRow}
          onSaveChanges={handleSaveChanges}
          onDataChange={handleDataChange}
          addRowButtonText="Добавить клиента"
          saveButtonText="Сохранить все изменения"
          exportFilename="clients.xlsx"
          onImportData={handleImportData}
          validateCell={validateCell}
          autoSaveTimeout={autoSave ? 2000 : 0}
        />
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