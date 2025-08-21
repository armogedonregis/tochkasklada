import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export interface Permission {
  key: string;
  description: string;
}

export interface UserPermissions {
  [key: string]: Permission[];
}

export const useUserPermissions = () => {
  const { user } = useSelector((state: RootState) => state.user);
  
  // SUPERADMIN имеет доступ ко всему
  if (user?.role === 'SUPERADMIN') {
    return {
      hasPermission: () => true,
      canAccessPage: () => true,
      isSuperAdmin: true,
    };
  }

  // Для обычных пользователей проверяем права через admin роли
  const adminRoles = user?.admin?.adminRoles || [];
  const permissions = adminRoles.flatMap(ar => ar.role.rolePermissions || []).map(rp => rp.permission);

  const hasPermission = (permissionKey: string): boolean => {
    return permissions.some(p => p.key === permissionKey);
  };

  const canAccessPage = (page: string): boolean => {
    // Базовые страницы доступны всем авторизованным пользователям
    const publicPages = ['profile', 'logout'];
    if (publicPages.includes(page)) return true;

    // Проверяем права для конкретных страниц
    const pagePermissions: { [key: string]: string[] } = {
      'clients': ['clients:read'],
      'payments': ['payments:read'],
      'cell-rentals': ['rentals:read'],
      'locations': ['locations:read'],
      'containers': ['containers:read'],
      'cells': ['cells:read'],
      'requests': ['requests:read'],
      'list': ['lists:read'],
      'statistics': ['system:admin'],
      'logs': ['system:logs'],
      'settings': ['system:settings'],
      'sizes': ['system:admin'],
      'cell-statuses': ['system:admin'],
      'panels': ['system:admin'],
      'free-cells': ['cells:read'],
      'gantt': ['rentals:read'],
      'franchasing': ['system:admin'],
      'locs': ['locations:read'],
      'tinkoff-test': ['system:admin'],
      'docs': ['system:admin'],
    };

    const requiredPermissions = pagePermissions[page] || [];
    if (requiredPermissions.length === 0) {
      return false;
    }

    return requiredPermissions.some(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    canAccessPage,
    isSuperAdmin: false,
    permissions,
  };
};
