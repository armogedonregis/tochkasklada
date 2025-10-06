import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useUserPermissions } from '@/services/authService/userPermissions';
import type { NavigationItem } from './navigationConfig';

export const useNavigationAccess = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const userRole = user?.role || 'ADMIN';
  const { hasPermission, hasAnyPermission } = useUserPermissions();
  
  const isSuperAdmin = userRole === 'SUPERADMIN';
  
  const canAccessItem = (item: NavigationItem): boolean => {
    if (item.requireSuperAdmin && !isSuperAdmin) {
      return false;
    }
    
    if (!item.permission || (Array.isArray(item.permission) && item.permission.length === 0)) {
      return true;
    }

    if (isSuperAdmin) {
      return true;
    }
    
    if (Array.isArray(item.permission)) {
      return hasAnyPermission(item.permission);
    } else {
      return hasPermission(item.permission);
    }
  };
  
  return {
    canAccessItem,
    isSuperAdmin,
    userRole,
  };
};
