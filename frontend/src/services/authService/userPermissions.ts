import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// Интерфейс для прав пользователя
export interface UserPermissions {
  permissions: Set<string>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

// Хук для получения прав пользователя
export const useUserPermissions = (): UserPermissions => {
  const { user } = useSelector((state: RootState) => state.user);
  
  // Если пользователь SUPERADMIN, у него все права
  if (user?.role === 'SUPERADMIN') {
    const allPermissions = new Set([
      'users:read', 'users:create', 'users:update', 'users:delete',
      'roles:read', 'roles:create', 'roles:update', 'roles:delete',
      'permissions:read', 'permissions:assign',
      'cells:read', 'cells:create', 'cells:update', 'cells:delete',
      'rentals:read', 'rentals:create', 'rentals:update', 'rentals:delete',
      'clients:read', 'clients:create', 'clients:update', 'clients:delete',
      'requests:read', 'requests:update', 'requests:close',
      'lists:read', 'lists:create', 'lists:update', 'lists:close',
      'payments:read', 'payments:create', 'payments:update',
      'system:admin', 'system:logs', 'system:settings'
    ]);

    return {
      permissions: allPermissions,
      hasPermission: (permission: string) => allPermissions.has(permission),
      hasAnyPermission: (permissions: string[]) => permissions.some(p => allPermissions.has(p)),
      hasAllPermissions: (permissions: string[]) => permissions.every(p => allPermissions.has(p)),
    };
  }

  // Если пользователь не админ, у него нет прав
  if (user?.role !== 'ADMIN') {
    return {
      permissions: new Set(),
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
    };
  }

  // TODO: Здесь нужно будет получать права из API
  // Пока возвращаем базовые права для админа
  const adminPermissions = new Set([
    'users:read',
    'cells:read', 'cells:update',
    'rentals:read', 'rentals:create', 'rentals:update',
    'clients:read', 'clients:create', 'clients:update',
    'requests:read', 'requests:update', 'requests:close',
    'lists:read', 'lists:create', 'lists:update', 'lists:close',
    'payments:read', 'payments:create', 'payments:update',
  ]);

  return {
    permissions: adminPermissions,
    hasPermission: (permission: string) => adminPermissions.has(permission),
    hasAnyPermission: (permissions: string[]) => permissions.some(p => adminPermissions.has(p)),
    hasAllPermissions: (permissions: string[]) => permissions.every(p => adminPermissions.has(p)),
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
  
  const hasAccess = requireAll 
    ? userPermissions.hasAllPermissions(permissions)
    : userPermissions.hasAnyPermission(permissions);

  if (!hasAccess) {
    return fallback;
  }

  return children;
};