import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetCurrentUserQuery } from './authApi';

// Интерфейс для прав пользователя
export interface UserPermissions {
  permissions: Set<string>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isLoading: boolean;
}

// Хук для получения прав пользователя
export const useUserPermissions = (): UserPermissions => {
  const { user } = useSelector((state: RootState) => state.user);
  const { data: currentUser, isLoading, error } = useGetCurrentUserQuery(undefined, {
    // Принудительно загружаем данные пользователя если он аутентифицирован
    skip: !user?.id,
    // Кэшируем на 5 минут
    refetchOnMountOrArgChange: true,
  });
  
  // Если пользователь SUPERADMIN, у него все права
  if (user?.role === 'SUPERADMIN') {
    return {
      permissions: new Set(), // Пустой Set для SUPERADMIN чтобы PermissionGate работал правильно
      hasPermission: (permission: string) => true, // SUPERADMIN имеет все права
      hasAnyPermission: (permissions: string[]) => true, // SUPERADMIN имеет все права
      hasAllPermissions: (permissions: string[]) => true, // SUPERADMIN имеет все права
      isLoading: false,
    };
  }

  // Если пользователь не админ, у него нет прав
  if (user?.role !== 'ADMIN') {
    return {
      permissions: new Set(),
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      isLoading: false,
    };
  }

  // Если данные еще загружаются, возвращаем пустые права
  if (isLoading || !currentUser) {
    return {
      permissions: new Set(),
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      isLoading: true,
    };
  }

  // Собираем все права из ролей пользователя
  const userPermissions = new Set<string>();
  
  if (currentUser.admin?.adminRoles) {
    currentUser.admin.adminRoles.forEach(adminRole => {
      if (adminRole.role.rolePermissions) {
        adminRole.role.rolePermissions.forEach(rolePermission => {
          userPermissions.add(rolePermission.permission.key);
        });
      }
    });
  }

  return {
    permissions: userPermissions,
    hasPermission: (permission: string) => userPermissions.has(permission),
    hasAnyPermission: (permissions: string[]) => permissions.some(p => userPermissions.has(p)),
    hasAllPermissions: (permissions: string[]) => permissions.every(p => userPermissions.has(p)),
    isLoading: false,
  };
};

// Компонент для условного рендеринга на основе прав
export const PermissionGate: React.FC<{
  permissions: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ permissions, requireAll = false, children, fallback = null }) => {
  const userPermissions = useUserPermissions();
  
  // SUPERADMIN имеет доступ ко всему
  if (userPermissions.permissions.size === 0) {
    // Это SUPERADMIN (у него permissions = new Set())
    return children;
  }
  
  const hasAccess = requireAll 
    ? userPermissions.hasAllPermissions(permissions)
    : userPermissions.hasAnyPermission(permissions);

  if (!hasAccess) {
    return fallback;
  }

  return children;
};