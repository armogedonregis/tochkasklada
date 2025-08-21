export interface Permission {
  id: string;
  key: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionDto {
  key: string;
  description?: string;
}

export interface UpdatePermissionDto {
  key?: string;
  description?: string;
}

export interface PermissionsByCategory {
  [category: string]: Permission[];
}
