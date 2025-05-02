"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/auth/AuthGuard";

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

  // В реальном приложении здесь будет API-запрос для получения профиля
  useEffect(() => {
    // Имитация загрузки данных
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
  }, [user]);

  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Ваш профиль</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : user?.role === "ADMIN" ? (
          // Профиль администратора
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Информация об аккаунте</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Роль</p>
                    <p className="font-medium">Администратор</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Доступные действия</h2>
                <ul className="space-y-2">
                  <li>
                    <Button variant="outline" asChild>
                      <a href="/clients">Управление клиентами</a>
                    </Button>
                  </li>
                  {/* Другие действия администратора */}
                </ul>
              </div>
            </div>
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