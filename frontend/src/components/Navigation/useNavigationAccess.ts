import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useUserPermissions } from '@/services/authService/userPermissions';
import type { NavigationItem } from './navigationConfig';

export const useNavigationAccess = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const userRole = user?.role || 'ADMIN';
  const { hasPermission, hasAnyPermission } = useUserPermissions();
  
  // Проверяем, является ли пользователь SUPERADMIN
  const isSuperAdmin = userRole === 'SUPERADMIN';
  
  /**
   * Проверяет доступ пользователя к элементу навигации
   */
  const canAccessItem = (item: NavigationItem): boolean => {
    // Если требуется SUPERADMIN и пользователь не SUPERADMIN
    if (item.requireSuperAdmin && !isSuperAdmin) {
      return false;
    }
    
    // Если права не указаны, доступ есть у всех
    if (!item.permission || (Array.isArray(item.permission) && item.permission.length === 0)) {
      return true;
    }
    
    // SUPERADMIN имеет доступ ко всему
    if (isSuperAdmin) {
      return true;
    }
    
    // Проверяем права доступа
    if (Array.isArray(item.permission)) {
      // Если массив прав, проверяем наличие хотя бы одного
      return hasAnyPermission(item.permission);
    } else {
      // Если одно право, проверяем его
      return hasPermission(item.permission);
    }
  };
  
  return {
    canAccessItem,
    isSuperAdmin,
    userRole,
  };
};
