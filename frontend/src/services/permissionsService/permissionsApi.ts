import { api } from '../api';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionsByCategory } from './permissions.types';

export const permissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить все права
    getPermissions: builder.query<Permission[], void>({
      query: () => 'admin/permissions',
      providesTags: ['Permissions'],
    }),

    // Получить право по ID
    getPermissionById: builder.query<Permission, string>({
      query: (id) => `admin/permissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Permissions', id }],
    }),

    // Создать новое право
    createPermission: builder.mutation<Permission, CreatePermissionDto>({
      query: (data) => ({
        url: 'admin/permissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permissions'],
    }),

    // Обновить право
    updatePermission: builder.mutation<Permission, { id: string; data: UpdatePermissionDto }>({
      query: ({ id, data }) => ({
        url: `admin/permissions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Permissions', id }, 'Permissions'],
    }),

    // Удалить право
    deletePermission: builder.mutation<void, string>({
      query: (id) => ({
        url: `admin/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permissions'],
    }),

    // Получить права по категориям
    getPermissionsByCategory: builder.query<PermissionsByCategory, void>({
      query: () => 'admin/permissions/categories',
      providesTags: ['Permissions'],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useGetPermissionsByCategoryQuery,
} = permissionsApi;
