"use client";

import { useState } from 'react';
import { 
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation 
} from '@/services/usersService/usersApi';
import { useGetRolesQuery } from '@/services/rolesService/rolesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/services/usersService/users.types';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormModal } from '@/hooks/useFormModal';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { PermissionGate } from '@/services/authService';

// Схема валидации для создания пользователя
const createUserValidationSchema = yup.object({
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
  roleIds: yup.array().of(yup.string()).min(1, 'Выберите хотя бы одну роль').required('Выберите роли'),
});

// Схема валидации для редактирования пользователя
const editUserValidationSchema = yup.object({
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').optional(),
  roleIds: yup.array().of(yup.string()).min(1, 'Выберите хотя бы одну роль').required('Выберите роли'),
});

// Типы для формы
interface UserFormFields {
  email: string;
  password: string;
  roleIds?: string[];
}

export default function UsersPage() {
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  
  // Получение данных о пользователях
  const { data: users = [], error, isLoading, refetch } = useGetUsersQuery();
  
  // Получение данных о ролях
  const { data: roles = [] } = useGetRolesQuery();

  // Мутации для операций с пользователями
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();

  // Хук для управления модальным окном
  const modal = useFormModal<UserFormFields, User>({
    onSubmit: async (values) => {
      if (modal.editItem) {
        const updateData: any = {
          email: values.email,
        };
        
        // Добавляем пароль только если он указан
        if (values.password) {
          updateData.password = values.password;
        }
        
        // Добавляем роли
        if (values.roleIds) {
          updateData.roleIds = values.roleIds;
        }
        
        await updateUser({ 
          id: modal.editItem.id,
          data: updateData
        }).unwrap();
        toast.success('Пользователь успешно обновлен');
      } else {
        await createUser({
          email: values.email,
          password: values.password,
          roleIds: values.roleIds || []
        }).unwrap();
        toast.success('Пользователь успешно создан');
      }
    },  
    onError: (error: any) => {
      toast.error(error?.data?.message || 'Произошла ошибка');
    },
    onSuccess: () => {
      modal.closeModal();
      refetch();
    }
  });

  // Обработчик удаления пользователя
  const handleDelete = async (user: User) => {
    try {
      await deleteUserMutation(user.id).unwrap();
      toast.success('Пользователь успешно удален');
      refetch();
      setDeleteUser(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Ошибка при удалении пользователя');
    }
  };

  // Определение колонок таблицы
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Роли',
      cell: ({ row }) => {
        const user = row.original;
        const roles = user.admin?.adminRoles?.map(ar => ar.role.name) || [];
        
        if (user.role === 'SUPERADMIN') {
          return (
            <Badge variant="destructive">
              Супер-админ
            </Badge>
          );
        }
        
        if (roles.length === 0) {
          return (
            <Badge variant="secondary">
              Без ролей
            </Badge>
          );
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((roleName, index) => (
              <Badge key={index} variant="default">
                {roleName}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="text-sm text-gray-500">
            {date.toLocaleDateString('ru-RU')}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const user = row.original;
        
        return (
          <div className="flex items-center gap-2">
            {user.role !== 'SUPERADMIN' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => modal.openEdit(user)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteUser(user)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Поля формы
  const formFields = [
    {
      type: 'input' as const,
      fieldName: 'email' as const,
      label: 'Email',
      placeholder: 'user@example.com',
      inputType: 'email' as const,
    },
    {
      type: 'input' as const,
      fieldName: 'password' as const,
      label: 'Пароль',
      placeholder: 'Минимум 6 символов',
      inputType: 'password' as const,
    },
    {
      type: 'searchSelect' as const,
      fieldName: 'roleIds' as const,
      label: 'Роли',
      placeholder: 'Выберите роли',
      options: roles.map(role => ({
        value: role.id,
        label: role.name
      })),
      isMulti: true,
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Ошибка загрузки пользователей: Неизвестная ошибка
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление пользователями</h1>
        <PermissionGate permissions={['users:create']}>
          <Button onClick={() => modal.openCreate()}>
            <Plus className="w-4 h-4 mr-2" />
            Создать пользователя
          </Button>
        </PermissionGate>
      </div>

      <BaseTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        totalCount={users.length}
      />

      {/* Модальное окно для создания/редактирования пользователя */}
      <BaseFormModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={modal.editItem ? 'Редактировать пользователя' : 'Создать пользователя'}
        fields={formFields}
        validationSchema={modal.editItem ? editUserValidationSchema : createUserValidationSchema}
        onSubmit={modal.handleSubmit}
        defaultValues={modal.editItem ? {
          email: modal.editItem.email,
          password: '', // Пароль не показываем при редактировании
          roleIds: modal.editItem.admin?.adminRoles?.map(ar => ar.role.id) || [],
        } : {
          email: '',
          password: '',
          roleIds: [],
        }}
        submitText={modal.editItem ? 'Сохранить' : 'Создать'}
        isLoading={modal.isLoading}
      />

      {/* Модальное окно подтверждения удаления */}
      {deleteUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Удалить пользователя?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Пользователь "{deleteUser.email}" будет удален безвозвратно.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteUser(null)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteUser)}
                className="flex-1"
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
