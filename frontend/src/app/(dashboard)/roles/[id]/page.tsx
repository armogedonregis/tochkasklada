"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useGetRoleByIdQuery, 
  useUpdateRoleMutation, 
  useCreateRoleMutation,
  useGetPermissionsByCategoryQuery 
} from "@/services/rolesService/rolesApi";
import BaseForm from "@/components/forms/BaseForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, X, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { Role } from "@/services/rolesService/roles.types";
import * as yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { IForm } from "@/components/forms/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

// Схема валидации для роли
const roleValidationSchema = yup.object({
  name: yup.string().required("Название роли обязательно"),
  description: yup.string().optional(),
});

// Типы для формы
interface RoleFormFields {
  name: string;
  description: string;
  [key: string]: any; // Разрешаем динамические поля для разрешений
}

export default function RoleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: boolean }>({});

  const isCreateMode = roleId === 'create';
  
  // Загружаем данные только если это не режим создания
  const { data: role, isLoading, error, refetch } = useGetRoleByIdQuery(roleId, {
    skip: isCreateMode
  });
  const { data: permissionsByCategory = {}, isLoading: permissionsLoading } = useGetPermissionsByCategoryQuery();

  // Отладочная информация
  console.log('permissionsByCategory:', permissionsByCategory);
  console.log('permissionsLoading:', permissionsLoading);

  // Устанавливаем первую категорию как активную при загрузке данных
  useEffect(() => {
    if (permissionsByCategory && Object.keys(permissionsByCategory).length > 0 && !activeCategory) {
      setActiveCategory(Object.keys(permissionsByCategory)[0]);
    }
  }, [permissionsByCategory, activeCategory]);

  // Инициализируем состояние выбранных разрешений при загрузке роли
  useEffect(() => {
    if (role?.rolePermissions && !isCreateMode) {
      const initialPermissions: { [key: string]: boolean } = {};
      role.rolePermissions.forEach(rp => {
        initialPermissions[`permission_${rp.permission.id}`] = true;
      });
      setSelectedPermissions(initialPermissions);
    }
  }, [role, isCreateMode]);
  
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  // Функция для получения понятного названия категории
  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'users': 'Пользователи',
      'roles': 'Роли',
      'permissions': 'Разрешения',
      'cities': 'Города',
      'locations': 'Локации',
      'containers': 'Контейнеры',
      'cells': 'Ячейки',
      'rentals': 'Аренды ячеек',
      'clients': 'Клиенты',
      'payments': 'Платежи',
      'requests': 'Заявки',
      'lists': 'Списки',
      'panels': 'Панели',
      'relays': 'Реле',
      'relay-access': 'Доступ к реле',
      'statistics': 'Статистика',
      'logs': 'Логи',
      'system': 'Система',
    };
    
    return categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Функция для подсчета активных разрешений в категории
  const getActivePermissionsCount = (category: string, formValues?: any) => {
    if (!permissionsByCategory[category]) return 0;
    
    if (formValues) {
      // Для формы - считаем выбранные чекбоксы
      return permissionsByCategory[category].filter(permission => 
        formValues[`permission_${permission.id}`]
      ).length;
    } else if (selectedPermissions && Object.keys(selectedPermissions).length > 0) {
      // Для формы - считаем выбранные разрешения из состояния
      return permissionsByCategory[category].filter(permission => 
        selectedPermissions[`permission_${permission.id}`]
      ).length;
    } else if (role?.rolePermissions) {
      // Для просмотра - считаем назначенные разрешения
      return permissionsByCategory[category].filter(permission => 
        role.rolePermissions.some(rp => rp.permission.id === permission.id)
      ).length;
    }
    
    return 0;
  };

  // Обработчик изменения чекбокса разрешения
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [`permission_${permissionId}`]: checked
    }));
  };

  // Обработчик создания/обновления роли
  const handleSubmit = async (values: any) => {
    try {
      // Собираем ID выбранных разрешений
      const selectedPermissionIds = Object.keys(values)
        .filter(key => key.startsWith('permission_') && values[key])
        .map(key => key.replace('permission_', ''));

      if (isCreateMode) {
        await createRole({
          name: values.name,
          description: values.description || undefined,
          permissionIds: selectedPermissionIds,
        }).unwrap();
        toast.success("Роль успешно создана");
        router.push("/roles");
      } else {
        await updateRole({
          id: roleId,
          data: {
            name: values.name,
            description: values.description || undefined,
            permissionIds: selectedPermissionIds,
          }
        }).unwrap();
        
        toast.success("Роль успешно обновлена");
        setIsEditing(false);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Ошибка при ${isCreateMode ? 'создании' : 'обновлении'} роли`);
    }
  };

  // Поля формы (только базовые поля, разрешения отображаются через табы)
  const formFields: IForm<RoleFormFields>[] = [
    {
      type: "input" as const,
      fieldName: "name" as const,
      label: "Название роли",
      placeholder: "Например: Оператор, Менеджер",
    },
    {
      type: "input" as const,
      inputType: "textarea",
      fieldName: "description" as const,
      label: "Описание",
      placeholder: "Краткое описание роли",
    },
  ];

  // В режиме создания показываем только форму
  if (isCreateMode) {
    // Показываем загрузку если права еще загружаются
    if (permissionsLoading) {
      return (
        <div className="p-6">
          <div className="text-center">Загрузка прав доступа...</div>
        </div>
      );
    }

    // Проверяем есть ли данные о правах
    if (!permissionsByCategory || Object.keys(permissionsByCategory).length === 0) {
      return (
        <div className="p-6">
          <div className="text-center text-red-600">
            Ошибка загрузки прав доступа. Попробуйте обновить страницу.
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push("/roles")}
          >
            Вернуться к ролям
          </Button>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Заголовок */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/roles")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Создать новую роль</h1>
        </div>

        {/* Форма создания */}
        <Card>
          <CardHeader>
            <CardTitle>Создание новой роли</CardTitle>
          </CardHeader>
          <CardContent>
            {permissionsLoading ? (
              <div className="text-center py-4">Загрузка прав доступа...</div>
            ) : (
              <div className="space-y-6">
                {/* Базовые поля */}
                <BaseForm
                  fields={formFields}
                  validationSchema={roleValidationSchema}
                  onSubmit={handleSubmit}
                  defaultValues={{
                    name: "",
                    description: "",
                  }}
                  renderButtons={() => null} // Убираем кнопки, они будут внизу
                />

                {/* Табы с разрешениями */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Права доступа</h3>
                  <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 h-auto p-1 bg-gray-100 dark:bg-gray-800">
                      {Object.keys(permissionsByCategory).map(category => (
                        <TabsTrigger 
                          key={category} 
                          value={category} 
                          className="text-xs px-2 py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded"
                        >
                          {getCategoryLabel(category)}
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            ({getActivePermissionsCount(category)}/{permissionsByCategory[category].length})
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                      <TabsContent key={category} value={category} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {permissions.map(permission => (
                            <label key={permission.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <input
                                type="checkbox"
                                name={`permission_${permission.id}`}
                                checked={selectedPermissions[`permission_${permission.id}`] || false}
                                onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {permission.description || permission.key}
                              </span>
                            </label>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                {/* Кнопка создания */}
                <div className="flex justify-end">
                  <Button onClick={() => {
                    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
                    const values: any = {};
                    formData.forEach((value, key) => {
                      if (!key.startsWith('permission_')) {
                        values[key] = value;
                      }
                    });
                    // Добавляем выбранные разрешения из состояния
                    Object.entries(selectedPermissions).forEach(([key, value]) => {
                      if (value) {
                        values[key] = true;
                      }
                    });
                    handleSubmit(values);
                  }}>
                    Создать роль
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Загрузка для существующей роли
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Загрузка роли...</div>
      </div>
    );
  }

  // Ошибка для существующей роли
  if (error || !role) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Ошибка загрузки роли. Роль не найдена.
        </div>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push("/roles")}
        >
          Вернуться к ролям
        </Button>
      </div>
    );
  }

  // Подготавливаем значения по умолчанию для редактирования
  const defaultValues: any = {
    name: role.name,
    description: role.description || "",
  };

  // Добавляем значения для каждого разрешения
  if (role.rolePermissions) {
    role.rolePermissions.forEach(rp => {
      defaultValues[`permission_${rp.permission.id}`] = true;
    });
  }

  const getPermissionCount = () => {
    return role.rolePermissions?.length || 0;
  };

  const getAdminCount = () => {
    return role._count?.adminRoles || 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/roles")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к ролям
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Редактирование роли' : role.name}
          </h1>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
              <Button 
                type="submit" 
                form="role-form"
                disabled={isUpdating}
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Информация о роли */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Название</p>
                <p className="font-medium">{role.name}</p>
              </div>
              {role.description && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Описание</p>
                  <p className="font-medium">{role.description}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {getPermissionCount()} прав
                </Badge>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {getAdminCount()} админов
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Права доступа</CardTitle>
            </CardHeader>
            <CardContent>
              {role.rolePermissions && role.rolePermissions.length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(
                    role.rolePermissions.reduce((acc, rp) => {
                      const category = rp.permission.key.split(':')[0];
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(rp);
                      return acc;
                    }, {} as { [key: string]: typeof role.rolePermissions })
                  ).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b pb-1">
                        {getCategoryLabel(category)}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {permissions.map((rp) => (
                          <Badge key={rp.permission.id} variant="outline" className="text-xs">
                            {rp.permission.description || rp.permission.key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Права не назначены</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Форма редактирования */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Редактирование роли</CardTitle>
          </CardHeader>
          <CardContent>
            {permissionsLoading ? (
              <div className="text-center py-4">Загрузка прав доступа...</div>
            ) : !permissionsByCategory || Object.keys(permissionsByCategory).length === 0 ? (
              <div className="text-center text-red-600 py-4">
                Ошибка загрузки прав доступа
              </div>
            ) : (
              <div className="space-y-6">
                {/* Базовые поля */}
                <BaseForm
                  fields={formFields}
                  validationSchema={roleValidationSchema}
                  onSubmit={handleSubmit}
                  defaultValues={defaultValues}
                  renderButtons={() => null} // Убираем кнопки, они будут внизу
                />

                {/* Табы с разрешениями */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Права доступа</h3>
                  <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 h-auto p-1 bg-gray-100 dark:bg-gray-800">
                      {Object.keys(permissionsByCategory).map(category => (
                        <TabsTrigger 
                          key={category} 
                          value={category} 
                          className="text-xs px-2 py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded"
                        >
                          {getCategoryLabel(category)}
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            ({getActivePermissionsCount(category)}/{permissionsByCategory[category].length})
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                      <TabsContent key={category} value={category} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {permissions.map(permission => (
                            <label key={permission.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <input
                                type="checkbox"
                                name={`permission_${permission.id}`}
                                checked={selectedPermissions[`permission_${permission.id}`] || defaultValues[`permission_${permission.id}`] || false}
                                onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {permission.description || permission.key}
                              </span>
                            </label>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                {/* Кнопки редактирования */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => {
                    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
                    const values: any = {};
                    formData.forEach((value, key) => {
                      if (!key.startsWith('permission_')) {
                        values[key] = value;
                      }
                    });
                    // Добавляем выбранные разрешения из состояния
                    Object.entries(selectedPermissions).forEach(([key, value]) => {
                      if (value) {
                        values[key] = true;
                      }
                    });
                    handleSubmit(values);
                  }}>
                    Сохранить изменения
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
