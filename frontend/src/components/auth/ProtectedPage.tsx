'use client';

import { useUserPermissions } from '@/services/authService/userPermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredPermission?: string;
  pageName?: string;
}

export const ProtectedPage: React.FC<ProtectedPageProps> = ({
  children,
  requiredPermission,
  pageName,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, permissions, isLoading } = useUserPermissions();
  const router = useRouter();

  useEffect(() => {
    // Не проверяем права пока они загружаются
    if (isLoading) return;

    // SUPERADMIN имеет доступ ко всему
    if (permissions.size === 0) {
      return; // Это SUPERADMIN
    }

    // Если указано конкретное право, проверяем его
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/dashboard');
      return;
    }

    // Если указана страница, проверяем базовое право на чтение
    if (pageName) {
      const readPermission = `${pageName}:read`;
      if (!hasPermission(readPermission)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [hasPermission, pageName, requiredPermission, router, permissions, isLoading]);

  // Показываем загрузку пока загружаются права
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка прав доступа...</p>
        </div>
      </div>
    );
  }

  if (permissions.size === 0) {
    // SUPERADMIN - показываем сразу
    return <>{children}</>;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  if (pageName && !hasPermission(`${pageName}:read`)) {
    return null;
  }

  return <>{children}</>;
};
