"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/auth/AuthGuard";
import Link from "next/link";
import { useGetAdminProfileQuery, useCreateAdminProfileMutation } from "@/services/adminService/adminApi";
import { ToastService } from "@/components/toast/ToastService";
import { User, Shield, AlertTriangle, CheckCircle } from "lucide-react";

// Интерфейс для клиентского профиля 
interface ClientProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phones: { id: string; number: string }[];
}

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем админский профиль только для ADMIN и SUPERADMIN
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const { 
    data: adminProfile, 
    error: adminError, 
    isLoading: isAdminLoading,
    refetch: refetchAdminProfile 
  } = useGetAdminProfileQuery(undefined, {
    skip: !isAdmin
  });

  const [createAdminProfile, { isLoading: isCreating }] = useCreateAdminProfileMutation();

  const handleCreateAdminProfile = async () => {
    try {
      await createAdminProfile().unwrap();
      ToastService.success('Админский профиль успешно создан!');
      refetchAdminProfile();
    } catch (error: any) {
      ToastService.error(error?.data?.message || 'Ошибка при создании админского профиля');
    }
  };

  // В реальном приложении здесь будет API-запрос для получения профиля
  useEffect(() => {
    // Имитация загрузки данных для клиентов
    if (!isAdmin) {
      setTimeout(() => {
        if (user) {
          // Фейковые данные для демонстрации
          setProfile({
            userId: user.id,
            email: user.email,
            firstName: "Иван",
            lastName: "Клиентов",
            company: "ООО Клиент",
            phones: [
              { id: "1", number: "+7 (911) 123-45-67" },
              { id: "2", number: "+7 (922) 765-43-21" },
            ],
          });
        }
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [user, isAdmin]);

  return (
    <AuthGuard>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Профиль</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Управление личными данными и настройками аккаунта
          </p>
        </div>
        
        {(isLoading || isAdminLoading) ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : isAdmin ? (
          // Профиль администратора
          <div className="space-y-6">
            {/* Основная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Информация об аккаунте
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Роль</p>
                    <Badge variant={user.role === 'SUPERADMIN' ? 'default' : 'secondary'}>
                      {user.role === 'SUPERADMIN' ? 'Супер Администратор' : 'Администратор'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Админский профиль */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Административный профиль
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminError && (adminError as any)?.status === 404 ? (
                  // Профиль не найден
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Ваш административный профиль не создан. Создайте его для возможности управления заявками и листом ожидания.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      onClick={handleCreateAdminProfile}
                      disabled={isCreating}
                      className="w-full gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      {isCreating ? 'Создаю профиль...' : 'Создать административный профиль'}
                    </Button>
                  </div>
                ) : adminProfile ? (
                  // Профиль существует
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Административный профиль активен. Вы можете управлять заявками и листом ожидания.
                      </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">ID профиля</p>
                        <p className="font-mono text-xs">{adminProfile.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Создан</p>
                        <p>{new Date(adminProfile.createdAt).toLocaleDateString('ru-RU')}</p>
                      </div>
                    </div>
                  </div>
                ) : adminError ? (
                  // Ошибка загрузки
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Ошибка при загрузке административного профиля. Попробуйте обновить страницу.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </CardContent>
            </Card>

            {/* Быстрые действия */}
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/requests">Заявки</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/list">Лист ожидания</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/clients">Клиенты</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/statistics">Статистика</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : profile ? (
          // Профиль клиента
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Персональная информация</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Полное имя</p>
                  <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Компания</p>
                  <p className="font-medium">{profile.company}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Телефоны</h2>
              <div className="space-y-2">
                {profile.phones.map((phone) => (
                  <div key={phone.id} className="flex items-center">
                    <span className="font-medium">{phone.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Сообщение об ошибке
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
            <p className="text-lg mb-4">Не удалось загрузить данные профиля</p>
            <Button>Обновить страницу</Button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
} 