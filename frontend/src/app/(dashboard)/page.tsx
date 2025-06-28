"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Панель управления sfsdfadfasdf</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Карточка профиля */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ваш профиль</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium">{user?.email || "Загрузка..."}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Роль</p>
            <p className="font-medium">
              {user?.role === "ADMIN" ? "Администратор" : "Клиент"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/profile")}
          >
            Просмотреть профиль
          </Button>
        </div>

        {/* Карточка быстрых действий */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            {user?.role === "ADMIN" && (
              <Button 
                className="w-full justify-start" 
                onClick={() => router.push("/clients")}
              >
                Управление клиентами
              </Button>
            )}
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {}}
            >
              {user?.role === "ADMIN" 
                ? "Открыть статистику"
                : "Просмотреть данные"}
            </Button>
          </div>
        </div>
      </div>

      {/* Статистика и последние действия */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Последние действия</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Нет недавних действий для отображения
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 