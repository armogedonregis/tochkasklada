import { api } from '../api';
import { Role, CreateRoleDto, UpdateRoleDto, Permission, PermissionsByCategory } from './roles.types';

export const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить все роли
    getRoles: builder.query<Role[], void>({
      query: () => 'admin/roles',
      providesTags: ['Roles'],
    }),

    // Получить роль по ID
    getRoleById: builder.query<Role, string>({
      query: (id) => `admin/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Roles', id }],
    }),

    // Создать новую роль
    createRole: builder.mutation<Role, CreateRoleDto>({
      query: (data) => ({
        url: 'admin/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),

    // Обновить роль
    updateRole: builder.mutation<Role, { id: string; data: UpdateRoleDto }>({
      query: ({ id, data }) => ({
        url: `admin/roles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Roles', id },
        'Roles',
      ],
    }),

    // Удалить роль
    deleteRole: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `admin/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // Получить все права
    getPermissions: builder.query<Permission[], void>({
      query: () => 'admin/roles/permissions/all',
      providesTags: ['Permissions'],
    }),

    // Получить права по категориям
    getPermissionsByCategory: builder.query<PermissionsByCategory, void>({
      query: () => 'admin/roles/permissions/categories',
      providesTags: ['Permissions'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useGetPermissionsByCategoryQuery,
} = rolesApi;
