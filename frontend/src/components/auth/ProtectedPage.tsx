'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserPermissions } from '@/hooks/useUserPermissions';

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
  const { canAccessPage, isSuperAdmin } = useUserPermissions();
  const router = useRouter();

  useEffect(() => {
    // SUPERADMIN имеет доступ ко всему
    if (isSuperAdmin) return;

    // Если указана страница, проверяем доступ к ней
    if (pageName && !canAccessPage(pageName)) {
      router.push('/dashboard');
      return;
    }

    // Если указано конкретное право, проверяем его
    if (requiredPermission && !canAccessPage(requiredPermission)) {
      router.push('/dashboard');
      return;
    }
  }, [canAccessPage, isSuperAdmin, pageName, requiredPermission, router]);

  // Показываем загрузку пока проверяем права
  if (!isSuperAdmin && pageName && !canAccessPage(pageName)) {
    return null;
  }

  if (!isSuperAdmin && requiredPermission && !canAccessPage(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
};
