export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface AdminRole {
  role: Role;
}

export interface Admin {
  id: string;
  adminRoles: AdminRole[];
}

export interface User {
  id: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'CLIENT';
  createdAt: string;
  updatedAt: string;
  client?: Client;
  admin?: Admin;
}

export interface Client {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  roleIds?: string[];
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  roleIds?: string[];
}
