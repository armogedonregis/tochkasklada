export interface Permission {
  id: string;
  key: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  rolePermissions: {
    permission: Permission;
  }[];
  _count: {
    adminRoles: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface PermissionsByCategory {
  [category: string]: Permission[];
}
