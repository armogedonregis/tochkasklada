import { api } from '../api';

// Типы для запросов аутентификации
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  access_token: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  rolePermissions: Array<{
    permission: {
      key: string;
      description: string;
    };
  }>;
}

export interface AdminRole {
  role: Role;
}

export interface Admin {
  id: string;
  adminRoles: AdminRole[];
}

export interface UserData {
  id: string;
  email: string;
  role: string;
  admin?: Admin;
}

// Расширение базового API для аутентификации
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Логин пользователя
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Получение текущего пользователя
    getCurrentUser: builder.query<UserData, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useLoginMutation, 
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery
} = authApi; 